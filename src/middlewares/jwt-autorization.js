require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../models/user');


function authenticationMiddleware(req, res, next) {
    // Split "bearer" string
    const token = req.headers.authorization.split(' ')[1];
    // return res.status(200).json({ token });

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }

    try {
        const secretKey = process.env.SECRET_KEY

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    // El token ha caducado
                    return res.status(401).json({ error: 'Token expirado' });
                } else {
                    // El token es inválido por otra razón
                    return res.status(401).json({ error: 'Token inválido' });
                }
            }

            // El token es válido y no ha caducado
            const email = decoded.email;

            // Verificar si el usuario existe en la base de datos
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                return res.status(403).json({ message: 'Acceso denegado' });    
            }
            
            // El usuario tiene acceso, puedes continuar con el siguiente middleware o controlador
            next();
        });

    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Token de autenticación inválido' });
    }
}

module.exports = authenticationMiddleware;