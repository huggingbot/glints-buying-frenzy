import winston, { createLogger, format } from 'winston'

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      level: ['development', 'local'].includes(process.env.NODE_ENV || '') ? 'debug' : 'info',
      silent: ['test'].includes(process.env.NODE_ENV || ''),
    }),
  ],
})

export default logger
