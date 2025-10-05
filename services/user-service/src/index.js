import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

/* 🛡️ Security Middleware */
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

/* 🌐 CORS Configuration */
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
  })
);

/* 🚦 Rate Limiting */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/* ⚙️ Compression & Logging */
app.use(compression({ threshold: 1024 }));
app.use(morgan('dev'));

/* 📦 Body Parser */
app.use(express.json({ limit: '10mb' }));

/* ✅ Health Check */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* ✅ Root Endpoint */
app.get('/', (req, res) => {
  res.send('Hey there from backend 👋');
});

/* 🧩 Routes */
app.use('/auth', authRouter);

/* ⚠️ 404 Handler */
app.use((req, res) => {
  res
    .status(404)
    .json({ error: 'ROUTE_NOT_FOUND', message: 'Route not found' });
});

/* 🧱 Centralized Error Handler (AppError + fallback) */
app.use(errorHandler);

/* 🚀 Start Server */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
