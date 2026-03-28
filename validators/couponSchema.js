import joi from "joi";

export const ValidateCreateCoupon = joi.object({
    discount: joi
        .number()
        .min(1)
        .max(100)
        .integer()
        .required(),
    expiredAt: joi
        .date()
        .greater(Date.now())
        .required(),
}).required();

export const ValidateUpdateCoupon = joi.object({
    discount: joi
        .number()
        .min(1)
        .max(100)
        .integer(),
    expiredAt: joi
        .date()
        .greater(Date.now()),
    code:joi.string().required()
}).min(1);

export const ValidateDeleteCoupon = joi.object({
    code: joi.string().required(),
});
