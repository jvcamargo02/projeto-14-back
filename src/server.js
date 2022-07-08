<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoute from "./routes/authRoute.js"
=======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
>>>>>>> 1b25b9d828c693b5fe9574096b5c24a099eaa62c

import productsRouter from "./routes/productsRoute.js";
import shoppingCartRouter from "./routes/shoppingCartRoute.js";

<<<<<<< HEAD
=======
dotenv.config();

>>>>>>> 1b25b9d828c693b5fe9574096b5c24a099eaa62c
const app = express();

app.use(express.json());
app.use(cors());
<<<<<<< HEAD

app.use(authRoute)
=======

app.use("/products", productsRouter);
app.use("/shopping-cart", shoppingCartRouter);

app.get("/", (req, res) => {
    console.log("aa");
    res.send("Hello world");
});
>>>>>>> 1b25b9d828c693b5fe9574096b5c24a099eaa62c

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor running on port ${PORT}`));
