import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { swaggerUi, swaggerSpec } from './swagger.js';
import logger from '../../shared/utils/logger.js';

dotenv.config();
const app = express();

// Security middleware: minimal CSP and standard protections
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// CORS configuration: configure allowed origins via env (comma-separated)
// app.use(
//   cors({
//     origin: process.env.ALLOWED_ORIGINS?.split(',') || [
//       'http://localhost:3000',
//     ],
//     credentials: true,
//   })
// );

// Rate limiting: basic IP-based rate limiting for all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(
  morgan('combined', {
    stream: {
      write: msg => logger.info(msg.trim()),
    },
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API Gateway
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Basic welcome message from the backend
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: hey there from backend
 */
app.get('/', (req, res) => {
  res.send('hey there from backend');
});

// Proxy /api requests to user-service
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // remove /api prefix when forwarding to user-service
    },
    onError: (err, req, res) => {
      logger.error('Proxy error:', err);
      res.status(500).json({ error: 'Service unavailable' });
    },
  })
);

// Global error handler (kept in root app for non-user-service endpoints)
app.use((err, req, res, _next) => {
  logger.error('Unhandled error', { stack: err.stack, message: err.message });
  res.status(500).json({
    error: 'Something went wrong!',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Adaptor pattern for dbs
// Encrypt data
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
