import dotenv from 'dotenv';
import mysql from "mysql2";
dotenv.config();

const port = process.env.PORT || 3000;

import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { AuthController } from './auth-controller';
import dataRouter from './routes';
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//Database connection configuration
export const db = mysql.createConnection({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

//Test connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('MySQL connection successfully established');
});


const auth = new AuthController(express.Router(), db);
auth.registerEndpoints();
app.use("/api/auth", auth.Router);

app.use("/api", auth.authGuard.bind(auth), dataRouter);

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});