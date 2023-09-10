import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { dbConnection } from './config/database';
import userRouter from './routes/user.routes';
import { getSecret } from './utils/token';


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', userRouter);

dbConnection();
const port = process.env.PORT || 2812;

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))