import getDb from "../dbStrategy/mongo.js";

export async function getProductsList(req, res) {
    try {
        const db = getDb();

        const products = await db.collection("products").find().toArray();

        res.status(201).send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while getting products list");
    }
}
