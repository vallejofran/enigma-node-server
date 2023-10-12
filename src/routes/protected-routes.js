const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/jwt-autorization')

// const usersController = require('../controllers/users-controller')


router.get('/validate-token', authMiddleware, (req, res) => {
    res.status(200).send('Enhorabuena has accedido a una ruta protegida')
});

router.get('/renew-token', authMiddleware, (req, res) => {
    res.status(200).send('Enhorabuena has accedido a una ruta protegida')
});


module.exports = router;