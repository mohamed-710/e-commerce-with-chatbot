import appError from "../utils/appError.js";

const allowedOrigins = [
    'http://localhost:3000',
];

export const corsMiddleware = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') return next();
    const origin = req.headers["origin"];

    console.log(origin);

    if (req.originalUrl.includes('auth/activate_account')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        return next();
    }

    if (!allowedOrigins.includes(origin)) {
        return next(new Error("Not Allowed origin"));

    }
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Methods", "* ");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Private-Network", true);
    return next();
}


