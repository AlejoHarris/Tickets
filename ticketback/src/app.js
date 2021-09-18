import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import images from './routes/images.routes';
import tickets from './routes/tickets.routes';
import users from './routes/users.routes';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/api/tickets', tickets);
app.use('/api/images', images);
app.use('/api/users', users)

export default app;