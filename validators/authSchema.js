import joi from "joi";
export const validateRegisterUser = joi
        .object({
                userName: joi.string().trim().min(3).max(20).required(),
                email: joi.string().trim().email().lowercase().required(),
                password: joi.string().min(6).required(),
                confirmPassword: joi.string().valid(joi.ref("password")).required(),
        }).required();


export const validateActivateAccount = joi.object
        ({ token: joi.string().required() }).required();

export const validateLogin = joi
        .object({
                email: joi.string().trim().email().lowercase().required(),
                password: joi.string().min(6).required(),
        }).required();

export const ValidateForgetCode = joi
        .object({
                email: joi.string().trim().email().lowercase().required(),
        }).required();


export const ValidateresetPassword = joi.object({
        email: joi.string().trim().email().lowercase().required(),
        forgetcode: joi.string().length(5).required(),
        password: joi.string().min(6).required(),
        confirmPassword: joi.string().valid(joi.ref("password")).required(),
}).required()