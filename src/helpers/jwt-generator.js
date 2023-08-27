const jwt = require('jsonwebtoken');


const JWTgenerator = (payload = '') => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '4h' }, (err, token) => {
            if (err) reject('No se pudo generar el token')
            else resolve(token);
        })
    })
}

module.exports = {
    JWTgenerator
}