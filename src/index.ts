import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { dbConnection } from './config/database';
import router from './routes/routes';



const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', router);

dbConnection();
const port = process.env.PORT || 2812;

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))