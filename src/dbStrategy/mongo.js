import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);

mongoClient
    .connect()
    .then(() => {
        db = mongoClient.db(process.env.MONGO_DATABASE);
        console.log("conectou");
    })
    .catch(() => {
        console.log("Failed to connect to MongoDb");
    });

export default function getDb() {
    return db;
}
