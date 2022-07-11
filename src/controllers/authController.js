import getDb from "../dbStrategy/mongo.js";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
    const userData = res.locals.user;
console.log(userData)
    try {
        const db = getDb();
        const validation = await db.collection("plans").findOne({
            selectPlanId: userData.selectPlanId
        });
console.log(validation)
        await db.collection("users").insertOne({
            ...userData,
            validation: dayjs().add(validation.monthsTillExpire, "month").format("DD/MM/YY")
        });

        const newUser = await db.collection("users").findOne(userData);

        await db.collection("shopping-carts").insertOne({
            userId: newUser._id,
            cart: [],
            lastPurchaseDate: ""
        });

        res.status(201).send("Created user");
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}

export async function login(req, res) {
    const db = getDb();
    const userData = res.locals.user;
    const userSession = await db.collection("sessions").findOne({
        userId: userData._id
    });

    const token = uuid();

/*     if (userSession) {
        await db.collection("sessions").deleteOne({
            userId: userData._id
        });
    } */

    try {
        await db.collection("sessions").insertOne({
            userId: userData._id,
            token
        });

        res.status(200).send(token);
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}
