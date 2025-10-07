import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

// Development format: colorized and readable
const devFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(({ level, message, timestamp, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${rest}`;
  })
);

// Production format: JSON for structured logs
const prodFormat = format.combine(format.timestamp(), format.json());

const baseFormat = isProduction ? prodFormat : devFormat;

//  Transports

const loggerTransports = [new transports.Console()];

// Optional: Daily rotating file transport in production
if (isProduction) {
  loggerTransports.push(
    new transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxFiles: '14d', // keep logs for 14 days
      zippedArchive: true, // compress old logs
    })
  );

  loggerTransports.push(
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      zippedArchive: true,
    })
  );
}

// Create Logger

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: baseFormat,
  transports: loggerTransports,
  exitOnError: false,
});

//  Optional HTTP Logger for Morgan

logger.http = createLogger({
  level: 'http',
  format: baseFormat,
  transports: loggerTransports,
});

export default logger;
