import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import shoppingCartRouter from "./routes/shoppingCart.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/shopping-cart", shoppingCartRouter);

app.get("/", (req, res) => {
    console.log("aa");
    res.send("Hello world");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor running on port ${PORT}`));
