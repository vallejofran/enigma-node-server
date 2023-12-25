import bcrypt from "bcrypt";

import User from "../models/user.js";
import googleVerify from "../helpers/google-verify.js";
import { JWTgenerator } from "../helpers/jwt-generator.js";

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    // Obtener los datos del usuario desde el cuerpo de la solicitud
    const { username, firstname, lastname, email, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "El usuario ya existe" });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear una instancia del modelo User con los datos proporcionados
    const user = new User({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos
    await user.save();

    res.status(201).json({ message: "Usuario registrado exitosamente", user });
  } catch (error) {
    res.status(401).json({ error: "Error al registrar el usuario" });
  }
};

const loginUser = async (req, res) => {
  try {
    // Obtener los datos de inicio de sesión desde el cuerpo de la solicitud
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(200).json({ message: "Usuario no encontrado" });

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(200).json({ message: "Contraseña incorrecta" });

    // Generar un token de autenticación
    const token = await JWTgenerator({ email: user.email });

    // Crear un nuevo objeto de usuario con las propiedades justas y necesarias
    const userCleaned = { ...user.toObject() };
    delete userCleaned.password;
    delete userCleaned.__v;
    delete userCleaned._id;

    res.status(200).json({ user: userCleaned, token });
  } catch (error) {
    res.status(401).json({ error: "Error en el login de usuario" });
  }
};

const googleSignin = async (req, res = response) => {
  const { googleToken } = req.body;

  try {
    const { firstname, lastname, img, email } = await googleVerify(googleToken);

    let user = await User.findOne({ email }).select("+state");

    if (!user) {
      const newUser = {
        username: lastname + " " + firstname,
        firstname,
        lastname,
        email,
        password: ":P",
        img,
        google: true,
      };

      user = new User(newUser);
      await user.save();
    }

    if (!user.state)
      return res
        .status(401)
        .json({ message: "Hable con el administrador, user bloqueado" });

    const token = await JWTgenerator({ email: user.email });

    const userCleaned = { ...user.toObject() };
    delete userCleaned.state;
    delete userCleaned.__v;
    delete userCleaned._id;

    res.status(200).json({ user: userCleaned, token });
  } catch (error) {
    res.status(400).json({ message: "Token de Google no es válido" });
  }
};

const validateToken = (req, res) => {
  const { params } = req;
  if (params.token) res.status(200).json(params.token);
  else res.status(400).json({ message: "Token no es válido" });
};

export { registerUser, loginUser, googleSignin, validateToken };
