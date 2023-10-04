require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user')
const { googleVerify } = require('../helpers/google-verify');
const { JWTgenerator } = require('../helpers/jwt-generator');


// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
    try {
        
        // Obtener los datos del usuario desde el cuerpo de la solicitud
        const { username, firstname, lastname, email, password } = req.body;

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // return res.status(200).json({ existingUser });


        // Crear una instancia del modelo User con los datos proporcionados
        const user = new User({
            username,
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // return res.status(400).json({ user });

        // Guardar el usuario en la base de datos
        await user.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

const loginUser = async (req, res) => {
    try {
        // Obtener los datos de inicio de sesión desde el cuerpo de la solicitud
        const { email, password } = req.body;

        // Verificar si el usuario existe en la base de datos
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token de autenticación
        const token = await JWTgenerator({ email: user.email });

        // Por ahora, simplemente enviaremos un mensaje de éxito si el usuario existe
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

const googleSignin = async (req, res = response) => {
    const { token } = req.body;

    try {
        const { username, img, email } = await googleVerify(token);

        let user = await User.findOne({ email });

        if (!user) {
            const newUser = {
                username,
                email,
                password: ':P',
                img,
                google: true
            };

            user = new User(newUser);
            await user.save();
        }

        if (!user.state) return res.status(401).json({ message: 'Hable con el administrador, user bloqueado' });
        
        // Generar el JWT
        const token = await JWTgenerator(user.email);

        res.status(200)({ user, token });

    } catch (error) {
        res.status(400).json({ message: 'Token de Google no es válido' })
    }
}


module.exports = {
    registerUser,
    loginUser,
    googleSignin
};