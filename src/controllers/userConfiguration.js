import getDb from '../dbStrategy/mongo.js';

export function getData(req, res) {
	const userData = res.locals.user;

	res.status(200).send(userData);
}

export async function putData(req, res) {
	const db = getDb();
    const { _id }= res.locals.user
	const userData = res.locals.userData;
	const user = await db.collection('users').findOne({
		_id,
	});
    console.log(userData)
    const cvc = userData.userPaymentData.cvc
    console.log(userData)
	try {
		if (!cvc) {
			await db.collection('users').updateOne(
				{
					_id,
				},
				{
					$set: {
						...userData,
						userPaymentData: {
							cvc: user.userPaymentData.cvc,
							...userData.userPaymentData,
						},
					},
				}
			);
            return res.status(200).send()
		}
        await db.collection('users').updateOne(
            {
                _id,
            },
            {
                $set: {...userData}
            })

		res.status(200).send(user);
	} catch (err){
        console.log(err)
		res.status(500).send();
	}
}
