const mongoose = require('mongoose');

// Definición del esquema de usuarios
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true
    },
    firstname: {
        type: String,
        required: true,
        unique: false
    },
    lastname: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
        select: false
    },
    state: {
        type: Boolean,
        default: true,
        select: false
    },
    google: {
        type: Boolean,
        default: false,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;