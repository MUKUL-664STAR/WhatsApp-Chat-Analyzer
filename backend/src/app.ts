/**
 * WhatsApp Chat Analyzer API Server v2.0
 * 
 * Main application entry point
 * Configures Express app with middleware and routes, then starts the server
 * 
 * @module app
 * @version 2.0.0
 */

require('dotenv').config();
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import routes from './routes';
import { errorHandler } from './middleware/responseHandler';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.enable('trust proxy');

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  compression({
    threshold: 1024, 
    level: 6, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next) => {
    const start = Date.now();
    if (!req.path.includes('health')) {
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
          `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
        );
      });
    }
    next();
  });
}


app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'WhatsApp Chat Analyzer Backend',
    documentation: '/api/health',
  });
});

app.get('/status', (req: Request, res: Response) => {
  res.status(200).end();
});

app.head('/status', (req: Request, res: Response) => {
  res.status(200).end();
});

// Mount all API routes
app.use(routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});



app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log('============================================================');
  console.log('🚀 WhatsApp Chat Analyzer Backend');
  console.log('============================================================');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
