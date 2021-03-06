import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/authRoute.js"
import productsRouter from "./routes/productsRoute.js";
import shoppingCartRouter from "./routes/shoppingCartRoute.js";
import userConfig from "./routes/userConfig.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRoute)

app.use("/products", productsRouter);
app.use("/shopping-cart", shoppingCartRouter);
app.use(userConfig)

app.get("/", (req, res) => {
    console.log("aa");
    res.send("Hello world");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor running on port ${PORT}`));
