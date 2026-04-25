import logger from "../config/logger.js";
// performance monitoring middleware

const SLOW_THRESHOLD_MS = process.env.SLOW_THRESHOLD_MS || 500;

const slowLogger = (req, res, next) => {
    const start = process.hrtime.bigint(); // best than Date.now()
    res.on('finish', () => {
        const ms = Number(process.hrtime.bigint() - start) / 1e6; // in ms

        if (ms > SLOW_THRESHOLD_MS) {
            logger.warn('Slow request detected', {
                method: req.method,
                url: req.originalUrl,
                duration: `${ms.toFixed(2)}ms`,
                userId: req.user?._id || 'unauthenticated',
            });
        }
    });
    next();
}

export default slowLogger;
