import Joi from "joi";

export const registerUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  email: Joi.string().max(100).required(),
  name: Joi.string().max(100).optional(),
  password: Joi.string().max(100).required(),
});
