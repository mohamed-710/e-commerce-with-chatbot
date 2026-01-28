import jwt from "jsonwebtoken"

export const generateActivationToken = (email) => {
    return jwt.sign(
        { email }, 
        process.env.JWT_SECRET_ACTIVATION, 
        { expiresIn: '1h' } 
    );
}