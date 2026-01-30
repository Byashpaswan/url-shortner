const authRoute = require('express').Router();

const authController = require('../../controller/auth.controller');

authRoute.post('/register', authController.register);
authRoute.post('/login', authController.login);

module.exports = authRoute;