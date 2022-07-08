import { db } from '../dbStrategy/mongo.js';
import { hashSync} from "bcrypt"
import joi from "joi"


export async function authValidate (req, res, next){

    const {name, email, password, selectPlanId, userPaymentData } = req.body
    const {cvc, expiry, cardName, number } = req.body.userPaymentData
    const user = await db.collection("users").findOne({ email })
    console.log(req.body.userPaymentData)
    console.log(cvc)
    console.log(cardName)

    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        selectPlanId: joi.number().required(),
        userPaymentData: joi.object().required()
    })

    const paymentSchema= joi.object({
        cardName: joi.string().required(),
        cvc: joi.string().required(),
        expiry: joi.string().required(),
        number: joi.string().required(),
        
    })

    const signUpValidate = signUpSchema.validate(req.body)
    const paymentValidate = paymentSchema.validate(req.body.userPaymentData)

    if(signUpValidate.error || paymentValidate.error){
        console.log(signUpValidate.error)
        console.log(paymentValidate.error)
        return res.status(406).send(paymentValidate.error.details[0].message || signUpValidate.error.details[0].message)
    }

    if(user){
        return res.status(401).send("This email already exists")
    }

    const passwordCrypt = hashSync(password, 10)
    const cvcCrypt = hashSync(cvc, 10)

    delete req.body.password
    delete req.body.userPaymentData.cvc
    
    res.locals.user = {
        email,
        name,
        password: passwordCrypt,
        selectPlanId,
        userPaymentData: {
            expiry,
            cardName,
            number,
            cvc: cvcCrypt
        }
    }

    next()
}
