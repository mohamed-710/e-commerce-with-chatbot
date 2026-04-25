import winston from 'winston';
import path from 'path';
import fs from 'fs';

// pipeline
/*
log entry
format
transports
*/
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFormt = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (stack) {
            log += `\n${stack}`;
        }
        if (Object.keys(meta).length) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        return log;
    }),
);
const  logger =winston.createLogger({
    level: 'info',
    format: logFormt,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormt
            )
        }),

        new winston.transports.File({
            filename: path.join(logDir, 'errors.log'),
            level: 'error',
            format: logFormt,
            maxsize: 5 * 1024 * 1024,  
            maxFiles: 5,                
        }),

        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            format: logFormt,
            maxsize: 10 * 1024 * 1024, 
            maxFiles: 10,
        }),
    ],
});
export default logger;