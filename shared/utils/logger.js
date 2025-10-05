import { createLogger, format, transports } from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const baseFormat = isProduction
  ? format.combine(format.timestamp(), format.json())
  : format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ level, message, timestamp, ...meta }) => {
        const hasMeta = Object.keys(meta).length > 0;
        const rest = hasMeta ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${message}${rest}`;
      })
    );

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: baseFormat,
  transports: [new transports.Console()],
  exitOnError: false,
});

export default logger;
