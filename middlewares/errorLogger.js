import logger from '../config/logger.js';
//error middleware 
const errorLogger = (err, req, res, next) => {
    logger.error(err.message, {
        method: req.method,
        url: req.originalUrl,
        statusCode: err.statusCode || 500,
        userId: req.user?._id || 'unauthenticated',
        stack: err.stack,
        body: req.body,

    });
    next(err);
}

export default errorLogger;