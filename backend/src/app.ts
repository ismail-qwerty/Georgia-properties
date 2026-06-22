import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/environment.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import chatRoutes from './routes/chat.routes.js';
import specialLotsRoutes from './routes/specialLots.routes.js';
import { Logger } from './utils/logger.js';

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: ENV.CORS.ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  Logger.info(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

app.use(`/api/${ENV.API_VERSION}/auth`, authRoutes);
app.use(`/api/${ENV.API_VERSION}/users`, userRoutes);
app.use(`/api/${ENV.API_VERSION}/admin`, adminRoutes);
app.use(`/api/${ENV.API_VERSION}/chat`, chatRoutes);
app.use(`/api/${ENV.API_VERSION}/admin/special-lots`, specialLotsRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
