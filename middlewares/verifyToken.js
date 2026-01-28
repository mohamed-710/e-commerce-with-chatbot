import jwt from 'jsonwebtoken';
import httpStatusText from '../utils/httpStatusText.js';
import { handleJWTError } from '../utils/jwtHandle.js';

//verify Token 
//1.extract token from header or cookie
//2.check token if true 
//3.split token 
//4.decode payload in try catch block 
//5.catch error 

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        const error = AppError.create("unauthorized -no token provided", 401, httpStatusText.ERROR)
        return next(error);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            const error = AppError.create("unauthorized -invalid token", 401, httpStatusText.ERROR)
            return next(error);
        }
        req.user= decoded;
        next();
    } catch (err) {
     handleJWTError(err,next);
    }
};


