import express from "express";

import {validation} from "../middlewares/validation.js";

import { register,activateAccount, login,forgetCode, restPassword} from "../controllers/auth.controller.js";

import { validateRegisterUser,validateLogin ,validateActivateAccount,ValidateForgetCode, ValidateresetPassword} from "../validators/authSchema.js";
const route=express.Router();

// register 

route.post('/register',validation(validateRegisterUser),register);

//Activate Account 

route.get('/activate_account/:token',validation(validateActivateAccount),activateAccount);

//login 
route.post('/login',validation(validateLogin),login)

//send forget code 
route.patch('/forget-code',validation(ValidateForgetCode),forgetCode);

//reset password 
route.patch('/reset-password',validation(ValidateresetPassword),restPassword);
export default route;


