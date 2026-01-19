import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { allowedOrigins } from './config/index.config';

import authRouter from './routes/authentication.router';
import jejakRouter from './routes/jejak.router';
import { rateLimiter } from './middlewares/rateLimiter.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust first proxy (e.g., when behind a load balancer) so rate limiter sees real client IP
app.set('trust proxy', 1);

// Basic rate limiting to protect the API
app.use(rateLimiter);


app.get('/api/v1/health', (req, res) => { res.status(200).json({ status: 'OK', message: 'Server is running' }); });
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jejak', jejakRouter);

// Error handling middleware
app.use(errorHandler);

export default app;