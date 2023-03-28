const express = require('express');
const router = module.exports = express.Router();
const AuthController = require('./auth.controller')

// router => middleware => controller[service]
router.post('/sign-up', AuthController.signUp)
router.post('/sign-in', AuthController.signIn)
router.post('/sign-out', AuthController.signOut)
router.post('/refresh-token', AuthController.refreshToken)