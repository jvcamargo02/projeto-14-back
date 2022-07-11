import getDb from "../dbStrategy/mongo.js";

export async function getProductsList(req, res) {
    const user = res.locals.user;

    try {
        const db = getDb();

        const plan = await db.collection("plans-teste").findOne({
            name: user.plan
        });

        if (!plan) return res.status(404).send();

        const products = await db.collection("coffees-teste").find().toArray();

        res.status(201).send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while getting products list");
    }
}
