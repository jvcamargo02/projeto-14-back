import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

import getDb from '../dbStrategy/mongo.js';

export async function getShoppingCart(req, res) {
	const user = res.locals.user;

	try {
		const db = getDb();

		const cart = await db.collection('shopping-carts-teste').findOne({
			userId: user._id,
		});

		if (!cart) return res.status(404).send();

		const plan = await db.collection('plans-teste').findOne({
			name: user.plan,
		});

		if (!plan) return res.status(404).send();

		res.status(201).send({ cart: cart.cart, limit: plan.limit });
	} catch (err) {
		console.error(err);
		res.status(500).send('Error while getting shopping cart list');
	}
}

export async function insertProductToCart(req, res) {
	const user = res.locals.user;
	const productId = req.body.productId;

	try {
		const db = getDb();
		const product = await db.collection('coffees-teste').findOne({
			_id: ObjectId(productId),
		});

		if (!product) return res.status(404).send();

		const cart = await db.collection('shopping-carts-teste').findOne(
			{
				userId: user._id,
				'cart.product': product,
			},
			{ 'cart.$': 1 }
		);

		if (cart) return res.status(409).send();

		await db
			.collection('shopping-carts-teste')
			.updateOne(
				{ userId: user._id },
				{ $push: { cart: { product: product, counter: 1 } } }
			);

		res.status(201).send();
	} catch (err) {
		console.error(err);
		res.status(500).send(
			'Error while inserting new product to shopping cart'
		);
	}
}

export async function removeProductInCart(req, res) {
	const user = res.locals.user;
	const ID = req.params.ID;

	try {
		const db = getDb();
		const product = await db.collection('coffees-teste').findOne({
			_id: ObjectId(ID),
		});

		if (!product) return res.status(404).send();

		const cart = await db.collection('shopping-carts-teste').findOne(
			{
				userId: user._id,
				'cart.product': product,
			},
			{ 'cart.$': 1 }
		);

		if (!cart) return res.status(404).send('');

		await db
			.collection('shopping-carts-teste')
			.updateOne({ userId: user._id }, { $pull: { cart: { product } } });

		res.status(201).send();
	} catch (err) {
		console.error(err);
		res.status(500).send('Error while removing product to shopping cart');
	}
}

export async function addProductCounter(req, res) {
	const user = res.locals.user;
	const ID = req.params.ID;

	try {
		const db = getDb();
		const product = await db.collection('coffees-teste').findOne({
			_id: ObjectId(ID),
		});

		if (!product) return res.status(404).send('aaa');

		const cart = await db.collection('shopping-carts-teste').findOne(
			{
				userId: user._id,
				'cart.product': product,
			},
			{ 'cart.$': 1 }
		);

		if (!cart) return res.status(404).send('bbbb');

		await db
			.collection('shopping-carts-teste')
			.updateOne(
				{ userId: user._id, 'cart.product': product },
				{ $inc: { 'cart.$.counter': 1 } }
			);

		res.status(201).send();
	} catch (err) {
		console.error(err);
		res.status(500).send(
			'Error while adding product counter in shopping cart'
		);
	}
}

export async function subtractProductCounter(req, res) {
	const user = res.locals.user;
	const ID = req.params.ID;

	try {
		const db = getDb();
		const product = await db.collection('coffees-teste').findOne({
			_id: ObjectId(ID),
		});

		if (!product) return res.status(404).send();

		const cart = await db.collection('shopping-carts-teste').findOne(
			{
				userId: user._id,
				'cart.product': product,
			},
			{ 'cart.$': 1 }
		);

		if (!cart) return res.status(404).send();

		await db
			.collection('shopping-carts-teste')
			.updateOne(
				{ userId: user._id, 'cart.product': product },
				{ $inc: { 'cart.$.counter': -1 } }
			);

		await db
			.collection('shopping-carts-teste')
			.updateOne(
				{ userId: user._id, 'cart.counter': { $lte: 0 } },
				{ $pull: { cart: { product } } }
			);

		res.status(201).send();
	} catch (err) {
		console.error(err);
		res.status(500).send(
			'Error while subtracting product counter in shopping cart'
		);
	}
}

export async function confirmPurchase(req, res) {
	const user = res.locals.user;

	try {
		const db = getDb();
		const cart = await db.collection('shopping-carts-teste').findOne({
			userId: user._id,
		});

		if (!cart) return res.status(404).send();

		if (cart.cart.length === 0) return res.status(409).send();

		for (let i = 0; i < 7; i++) {
			const date = dayjs().day(i).format('DD/MM/YY');
			if (date === cart.lastPurchaseDate)
				return res
					.status(409)
					.send(
						'You already made a purchase this week! Please wait next week to put a new order.'
					);
		}

		await db.collection('shopping-carts-teste').updateOne(
			{
				userId: user._id,
			},
			{ $set: { lastPurchaseDate: dayjs().format('DD/MM/YY') } }
		);

		res.status(201).send();
	} catch (err) {
		console.error(err);
		res.status(500).send('Error while confirming purchase');
	}
}
