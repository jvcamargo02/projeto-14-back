import joi from "joi";

export async function validateShippingAdress(req, res, next) {
    const shippingSchema = joi.object({
        address: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        zip: joi.string().required(),
        description: joi.string().allow("").optional()
    });

    const addressValidate = shippingSchema.validate(req.body);

    if (addressValidate.error) {
        console.error(addressValidate.error);
        return res.status(406).send("Confirm that all data is entered correctly");
    }

    next();
}
