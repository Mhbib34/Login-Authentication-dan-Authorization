import Joi from "joi";

export const registerUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  email: Joi.string().max(100).required(),
  name: Joi.string().max(100).optional(),
  password: Joi.string().max(100).required(),
});

export const loginUserValidation = Joi.object({
  email: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

export const getUserValidation = Joi.string().max(100).required();

export const updateUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  email: Joi.string().max(100).optional(),
  name: Joi.string().max(100).allow("").optional(),
  password: Joi.string().max(100).allow("").optional(),
});
