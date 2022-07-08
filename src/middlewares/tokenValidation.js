import getDb from "../dbStrategy/mongo.js";

export default async function validateToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.status(401).send();

    try {
        const db = getDb();
        const session = await db.collection("sessions-teste").findOne({
            token
        });

        if (!session) return res.status(401).send();

        const user = await db.collection("users-teste").findOne({
            _id: session.userId
        });

        if (!user) return res.status(401).send();

        delete user.password;

        res.locals.user = user;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while validating token");
    }
}