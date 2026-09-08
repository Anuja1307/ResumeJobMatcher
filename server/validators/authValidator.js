const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
});

const otpSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    otp: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            "string.pattern.base": "OTP must be exactly 6 digits"
        })
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    otp: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            "string.pattern.base": "OTP must be exactly 6 digits"
        }),

    newPassword: Joi.string()
        .min(8)
        .max(100)
        .required()
});

module.exports = {
    registerSchema,
    loginSchema,
    otpSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};