import { ObjectId } from "mongodb";

import getDb from "../dbStrategy/mongo.js";

export async function addProductToCart(req, res) {
    const user = res.locals.user;
    const ID = req.params.ID;

    try {
        const db = getDb();
        const product = await db.collection("coffees-teste").findOne({
            _id: ObjectId(ID)
        });

        if (!product) return res.status(404).send();

        const cart = await db.collection("shopping-carts-teste").findOne(
            {
                userId: user._id,
                "cart.product": product
            },
            { "cart.$": 1 }
        );

        if (cart) return res.status(409).send();

        await db
            .collection("shopping-carts-teste")
            .updateOne(
                { userId: user._id },
                { $push: { cart: { product: product, counter: 1 } } }
            );

        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while adding new product to shopping cart");
    }
}

export async function removeProductInCart(req, res) {
    const user = res.locals.user;
    const ID = req.params.ID;

    try {
        const db = getDb();
        const product = await db.collection("coffees-teste").findOne({
            _id: ObjectId(ID)
        });

        if (!product) return res.status(404).send();

        const cart = await db.collection("shopping-carts-teste").findOne(
            {
                userId: user._id,
                "cart.product": product
            },
            { "cart.$": 1 }
        );

        if (!cart) return res.status(404).send("");

        await db
            .collection("shopping-carts-teste")
            .updateOne({ userId: user._id }, { $pull: { cart: { product } } });

        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while adding new product to shopping cart");
    }
}
