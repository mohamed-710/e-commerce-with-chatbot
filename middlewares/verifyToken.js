import jwt from 'jsonwebtoken';
import httpStatusText from '../utils/httpStatusText.js';
import { handleJWTError } from '../utils/jwtHandle.js';
import Token from "../models/token.js"
import AppError from '../utils/appError.js';
import User from "../models/user.js"
//verify Token 
//1.extract token from header or cookie
//2.check token if true and in Db
//3.check user existance 
//4.pass user
//3.split token 
//4.decode payload in try catch block 
//5.catch error 

export const verifyToken = async(req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        const error = AppError.create("unauthorized -no token provided", 401, httpStatusText.ERROR)
        return next(error);
    }
    
    const tokenDb=await Token.findOne({token,isValid:true});
    
    if(!tokenDb) return next (AppError.create("Token invalid or expired",404,httpStatusText.FAIL));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            const error = AppError.create("unauthorized -invalid token", 401, httpStatusText.ERROR)
            return next(error);
        }
        const user=await User.findById(decoded.id);

        if(!user) return next(AppError.create("user not found",404,httpStatusText.FAIL));
        
        req.user=user;
        
        next();

    } catch (err) {
     handleJWTError(err,next);
    }
};


