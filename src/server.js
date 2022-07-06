import express from "express"
import cors from "cors"
import { config } from "dotenv"

config();

const app = express()

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello world")
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Servidor running on port ${PORT}`))