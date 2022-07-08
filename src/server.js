import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoute from "./routes/authRoute.js"

config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRoute)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor running on port ${PORT}`));
