const Joi = require('joi');

const email = Joi.string().email().max(64).lowercase().required()
const password = Joi.string().min(8).max(20).required()
const firstName = Joi.string().max(56).required()
const lastName = Joi.string().max(56).required()

const userSignUpValidation = data => {
    const userSignUpSchema = Joi.object({
        email,
        password,
        firstName,
        lastName,
    })
    return userSignUpSchema.validate(data)
}

const userSignInValidation = data => {
    const userSignInSchema = Joi.object({
        email,
        password,
    })
    return userSignInSchema.validate(data)
}

module.exports = {
    userSignUpValidation,
    userSignInValidation
}