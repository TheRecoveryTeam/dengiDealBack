const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const tsFormat = () => (new Date()).toLocaleTimeString();

const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

module.exports = (config, type = 'app') => {
    const errorLog = `${config.errorLog}.${type}.log`;
    const combinedLog = `${config.combinedLog}.${type}.log`;

    const logger = winston.createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            myFormat
        ),
        transports: [
            new winston.transports.File({
                filename: errorLog || 'error.log', level: 'error',
                timestamp: tsFormat,
            }),
            new winston.transports.File({
                filename: combinedLog || 'combined.log',
                timestamp: tsFormat,
            })
        ]
    });

    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));

    return logger;
};
