import getDb from '../dbStrategy/mongo.js';

export default async function validateToken(req, res, next) {
	const authorization = req.headers.authorization;
	const token = authorization?.replace('Bearer ', '');
console.log(token)
	if (!token) return res.status(401).send();

	try {
		const db = getDb();
		const session = await db.collection('sessions').findOne({
			token,
		});

		if (!session) return res.status(401).send('Não tem sessão');

		const user = await db.collection('users').findOne({
			_id: session.userId,
		});

		if (!user) return res.status(401).send("Token expired or invalid. You have to reconnect to the site");


		delete user.password;
        delete user.userPaymentData.cvc

		res.locals.user = user;

        next()
	} catch (err) {
		console.error(err);
		res.status(500).send('Error while validating token');
	}
}
