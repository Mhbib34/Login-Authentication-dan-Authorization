import { login, register, refreshToken } from "../services/user-service.js";

const registerHandler = async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const loginUserHandler = async (req, res, next) => {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshTokenHandler = async (req, res, next) => {
  try {
    const result = await refreshToken(req.body.refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  register: registerHandler,
  login: loginUserHandler,
  refreshToken: refreshTokenHandler,
};
