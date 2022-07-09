import getDb from '../dbStrategy/mongo.js';
import { compareSync, hashSync } from 'bcrypt';
import joi from 'joi';

export async function signUpValidate(req, res, next) {
	const db = getDb();
	const { name, email, password, selectPlanId, userPaymentData } = req.body;
	const { cvc, expiry, cardName, number } = req.body.userPaymentData;
	const user = await db.collection('users').findOne({ email });

	const signUpSchema = joi.object({
		name: joi.string().required(),
		email: joi.string().email().required(),
		password: joi.string().required(),
		selectPlanId: joi.number().required(),
		userPaymentData: joi.object().required(),
	});

	const paymentSchema = joi.object({
		cardName: joi.string().required(),
		cvc: joi.string().required(),
		expiry: joi.string().required(),
		number: joi.string().required(),
	});

	const signUpValidate = signUpSchema.validate(req.body);
	const paymentValidate = paymentSchema.validate(req.body.userPaymentData);

	if (signUpValidate.error || paymentValidate.error) {
		return res
			.status(406)
			.send(
				paymentValidate.error.details[0].message ||
					signUpValidate.error.details[0].message
			);
	}

	if (user) {
		return res.status(401).send('This email already exists');
	}

	const passwordCrypt = hashSync(password, 10);
	const cvcCrypt = hashSync(cvc, 10);

	delete req.body.password;
	delete req.body.userPaymentData.cvc;

	res.locals.user = {
		email,
		name,
		password: passwordCrypt,
		selectPlanId,
		userPaymentData: {
			expiry,
			cardName,
			number,
			cvc: cvcCrypt,
		},
	};

	next();
}

export async function loginValidate(req, res, next) {
	const db = getDb();
	const { email, password } = req.body;

	const userSchema = joi.object({
		email: joi.string().email().required(),
		password: joi.string().required(),
	});

	const { error } = userSchema.validate(req.body);

	if (error) {
		return res.status(401).send(error.details[0].message);
	}

	const user = await db.collection('users').findOne({ email });

	if (!user || !compareSync(password, user.password)) {
		return res.status(401).send('Invalid e-mail or password');
	}

	delete [user.password, req.body.password];

	res.locals.user = user;
	next();
}
