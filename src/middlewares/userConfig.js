import getDb from '../dbStrategy/mongo.js';
import { compareSync, hashSync } from 'bcrypt';
import joi from 'joi';

async function validateTokenConfig(req, res, next) {
	const authorization = req.headers.authorization;
	const token = authorization?.replace('Bearer ', '');
	console.log(token);
	if (!token) return res.status(401).send();

	try {
		const db = getDb();
		const session = await db.collection('sessions').findOne({
			token,
		});

		if (!session)
			return res
				.status(401)
				.send(
					'Token expired or invalid. You have to reconnect to the site'
				);

		const user = await db.collection('users').findOne({
			_id: session.userId,
		});

		if (!user) return res.status(401).send();
		res.locals.user = user;

		next();
	} catch (err) {
		console.error(err);
		res.status(500).send('Error while validating token');
	}
}

async function confirmPassword(req, res, next) {
	const db = getDb();
	const { email, password } = req.body;
	console.log('entrou');
	console.log(email);
	const userSchema = joi.object({
		email: joi.string().email().required(),
		password: joi.string().required(),
	});

	const { error } = userSchema.validate({ email, password });

	if (error) {
		return res.status(401).send(error.details.message);
	}

	const user = await db.collection('users').findOne({ email });

	if (!user || !compareSync(password, user.password)) {
		return res.status(401).send('Invalid e-mail or password');
	}

	res.locals.user = user;
	next();
}

async function putValidate(req, res, next) {
	const db = getDb();
	const { name, email, password, selectPlanId, capsules, newPassword } =
		req.body;
	const { cvc, expiry, cardName, number } = req.body.userPaymentData;
	const { address, city, state, zip } = req.body.userAddress;
	const user = await db.collection('users').findOne({ email });
	const signUpSchema = joi.object({
		name: joi.string().required(),
		email: joi.string().email().required(),
		password: joi.string().required(),
		selectPlanId: joi.number().required(),
		capsules: joi.number().min(3).max(40).required(),
		userPaymentData: joi.object().required(),
		userAddress: joi.object().required(),
		newPassword: joi.string(),
	});

	const paymentSchema = joi.object({
		cardName: joi.string().required(),
		cvc: joi.string(),
		expiry: joi.string().required(),
		number: joi.string().required(),
	});

	const shippingSchema = joi.object({
		address: joi.string().required(),
		city: joi.string().required(),
		state: joi.string().required(),
		zip: joi.string().required(),
	});

	const signUpValidate = signUpSchema.validate(req.body);
	const paymentValidate = paymentSchema.validate(req.body.userPaymentData);
	const addressValidate = shippingSchema.validate(req.body.userAddress);

	if (
		signUpValidate.error ||
		paymentValidate.error ||
		addressValidate.error
	) {
		return res
			.status(406)
			.send('Confirm that all data is entered correctly');
	}

	if (user) {
		return res.status(401).send('This email already exists');
	}
	if (newPassword && cvc) {
		const passwordCrypt = hashSync(newPassword, 10);
		const cvcCrypt = hashSync(cvc, 10);

		res.locals.userData = {
			email,
			name,
			password: passwordCrypt,
			selectPlanId,
			capsules,
			userAddress: {
				address,
				city,
				state,
				zip,
			},
			userPaymentData: {
				expiry,
				cardName,
				number,
				cvc: cvcCrypt,
			},
		};

		next();
	}
	if (newPassword) {
		const passwordCrypt = hashSync(password, 10);

		res.locals.userData = {
			email,
			name,
			password: passwordCrypt,
			selectPlanId,
			capsules,
			userAddress: {
				address,
				city,
				state,
				zip,
			},
			userPaymentData: {
				expiry,
				cardName,
				number,
				cvc: cvcCrypt,
			},
		};

		next();
	}

	if (cvc) {
		const cvcCrypt = hashSync(cvc, 10);
		res.locals.userData = {
			email,
			name,
			password,
			selectPlanId,
			capsules,
			userAddress: {
				address,
				city,
				state,
				zip,
			},
			userPaymentData: {
				expiry,
				cardName,
				number,
				cvc: cvcCrypt,
			},
		};

		next();
	}

	next();
        res.locals.userData = {
			email,
			name,
			password,
			selectPlanId,
			capsules,
			userAddress: {
				address,
				city,
				state,
				zip,
			},
			userPaymentData: {
				expiry,
				cardName,
				number,
				cvc: "",
			},
    
}
}

export { validateTokenConfig, confirmPassword, putValidate };
