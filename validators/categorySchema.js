import joi from "joi";
export const ValidateCategorySchema=joi.object({
    name:joi.
    string()
    .min(5)
    .max(20)
    .required(),
}).required();