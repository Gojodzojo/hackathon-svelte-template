import express from 'express';
import cors from 'cors';
import { API_PORT } from './constants';
import { loadEnv } from './env';
import auth from "./endpoints/auth/auth"

loadEnv()

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Api enpoints
app.use("/auth", auth);

app.listen(API_PORT, () => {
    console.log(`App listening on port ${API_PORT}`);
});