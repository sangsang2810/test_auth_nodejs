require('dotenv').config();
const bcrypt = require('bcrypt');
const knex_syntax_model = require('../helpers/knex_syntax_model');
const JWT = require('jsonwebtoken');

module.exports = {
    hashPassword: async function (password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            return hashPassword;
        } catch (error) {
            next(error)
        }
    },
    isValidPassword: async function (password, userId) {
        try {
            const user = knex_syntax_model({
                name: "users",
                tableName: "users",
                selectableProps: 'password'
            });
            const userPassword = await user.find({ id: userId })
            return await bcrypt.compare(password, userPassword[0].password)
        } catch (error) {
            next(error)
        }
    },
    signAccessToken: async function (userId) {
        return new Promise((resolve, reject) => {
            const payload = {
                userId
            };

            const secret = process.env.JWT_SECRET;
            const option = { expiresIn: '1h' }

            JWT.sign(payload, secret, option, (err, token) => {
                if (err) reject(err)
                resolve(token)
            });
        })
    },
    signRefreshToken: async function (userId) {
        return await new Promise((resolve, reject) => {
            const payload = {
                userId
            }
            const secret = process.env.JWT_REFRESH_SECRET;
            const option = { expiresIn: '30d' }

            JWT.sign(payload, secret, option, (err, token) => {
                if (err) reject(err)
                resolve(token)
            });
        })
    },
}

