import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

// Development: pretty printed logs
const devOptions = {
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
};

// Production: JSON logs with file rotation
const prodOptions = {
  level: 'info',
  formatters: {
    level: label => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Create Logger
const logger = pino(isProduction ? prodOptions : devOptions);

// Optional HTTP Logger (for compatibility with existing code)
logger.http = logger.child({ component: 'http' });

export default logger;
