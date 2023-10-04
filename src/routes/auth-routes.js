const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controllers/auth-controller')
const {fieldsValidator} = require('../middlewares/fields-validator')


router.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

router.post('/register', authController.registerUser);

router.post('/lgoin', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldsValidator
], authController.loginUser);

router.post('/login-with-google', [
    check('token', 'El token es necesario').not().isEmpty(),
], authController.googleSignin);



router.put('/users/:id', (req, res) => {
    // Manejar la petición PUT a '/users/:id'
    // Actualizar un usuario con el ID proporcionado
});

router.delete('/users/:id', (req, res) => {
    // Manejar la petición DELETE a '/users/:id'
    // Eliminar un usuario con el ID proporcionado
});

module.exports = router;