import { db } from '../dbStrategy/mongo.js';
import {v4 as uuid} from "uuid"

export async function signUp (req, res) {
    const userData = res.locals.user
    console.log(userData)
    try{
        await db.collection("users").inserOne(userData)

        res.status(201).send("Created user")
    } catch{
        res.status(500).send("An error occurred. Please try again later.")
    }
}