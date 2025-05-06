import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandlers from './app/middlewares/globalErrorHandlers';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(
  cors({
    origin: ['https://meal-box-client-2.vercel.app', 'http://localhost:3000'],
    credentials: true,
  }),
);

app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//not found
app.use(notFound);

// Error-handling middleware
app.use(globalErrorHandlers);

export default app;
