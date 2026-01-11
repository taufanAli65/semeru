import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.middleware';

import authRouter from './routes/authentication.router';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/v1/health', (req, res) => { res.status(200).json({ status: 'OK', message: 'Server is running' }); });
app.use('/api/v1/auth', authRouter);

// Error handling middleware
app.use(errorHandler);

export default app;