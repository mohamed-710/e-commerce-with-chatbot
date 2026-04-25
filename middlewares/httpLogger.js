import morgan from 'morgan';
import logger from '../config/logger.js';


const stream = {
    write: (message) => {
        logger.http(message.trim())
    }
};

const httpLogger = morgan(
    ':method :url :status :res[content-length] bytes — :response-time ms — :remote-addr',
    {
        stream,
        skip: (req) => req.path === '/metrics'
    }
);

export default httpLogger;