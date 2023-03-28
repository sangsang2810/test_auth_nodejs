
const { userSignUpValidation, userSignInValidation, } = require('../helpers/validation');
const createError = require('http-errors')
const authService = require('./auth.service')
const JWT = require('jsonwebtoken');
const knex_model = require('../helpers/knex_syntax_model');

module.exports = {
    signUp: async function (req, res, next) {
        try {
            const { error } = userSignUpValidation(req.body)
            if (error) {
                throw createError[400](error.details[0].message);
            }
            const { email, password, firstName, lastName } = req.body

            const user = knex_model({
                name: "users",
                tableName: "users",
                selectableProps: 'id'
            });
            // check exist user
            const isValidEmail = await user.find({ email })
            if (isValidEmail[0]) {
                throw createError[400]('email is exist !');
            }

            // save user
            const hashPassword = await authService.hashPassword(password)
            const newUser = {
                email, password: hashPassword, firstName, lastName
            }
            const userId = await user.create(newUser)

            const response = {
                id: userId[0],
                email, firstName, lastName
            }
            res.json({
                status: 201,
                data: response
            })
        } catch (error) {
            next(error)
        }
    },
    signIn: async function (req, res, next) {
        try {
            const { error } = userSignInValidation(req.body)
            if (error) {
                throw createError[400](error.details[0].message);
            }
            const { email, password } = req.body

            const userModel = knex_model({
                name: "users",
                tableName: "users",
            });

            // check mail
            const userData = await userModel.find({ email })
            if (!userData[0]) {
                throw createError[400]('Email not register');
            }

            const { firstName, lastName, id } = userData[0];

            // check password 
            const isValid = await authService.isValidPassword(password, id);
            if (!isValid) {
                throw createError.Unauthorized();
            }
            const user = { id, email, firstName, lastName }

            const accessToken = await authService.signAccessToken(id);

            const tokenModel = knex_model({
                name: "token",
                tableName: "tokens",
            });

            let refreshToken;
            const refreshTokenData = await tokenModel.find({ userId: id })
            if (!refreshTokenData[0]) {
                const refToken = await authService.signRefreshToken(id);
                const newRefToken = {
                    userId: id,
                    refreshToken: refToken,
                    expiresIn: '30d'
                }
                await tokenModel.create(newRefToken)
                refreshToken = refToken
            } else {
                refreshToken = refreshTokenData[0].refreshToken
            }

            res.json({
                status: 204,
                data: {
                    user
                },
                token: accessToken,
                refreshToken
            })
        } catch (error) {
            next(error)
        }
    },
    signOut: async function (req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader.split(' ')[1];

            const { userId } = await JWT.verify(token, process.env.JWT_SECRET)

            const tokenModel = knex_model({
                name: "token",
                tableName: "tokens",
            });

            await tokenModel.destroy({ userId })
            res.json({
                status: 204,
            })
        } catch (error) {
            next(error)
        }
    },
    refreshToken: async function (req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokenModel = knex_model({
                name: "token",
                tableName: "tokens",
            });
            const refTokenData = await tokenModel.find({ refreshToken });
            if (!refTokenData[0]) {
                throw createError[404]('refresh token does not exist');
            }
            const { id, userId } = refTokenData[0]

            const accessToken = await authService.signAccessToken(userId);
            const newRefreshToken = await authService.signRefreshToken(userId);
            await tokenModel.update(id, { refreshToken: newRefreshToken })
            res.json({
                status: 204,
                token: accessToken,
                refreshToken: newRefreshToken
            })
        } catch (error) {
            next(error)
        }
    },
}