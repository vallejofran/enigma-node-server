const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controllers/auth-controller')

const {fieldsValidator} = require('../middlewares/fields-validator')
const authMiddleware = require('../middlewares/jwt-autorization')


router.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

router.post('/register', authController.registerUser);

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldsValidator
], authController.loginUser);

router.post('/login-google', [
    check('token', 'El token es necesario').not().isEmpty(),
], authController.googleSignin);

router.post('/validate-token', authMiddleware, authController.validateToken);

module.exports = router;