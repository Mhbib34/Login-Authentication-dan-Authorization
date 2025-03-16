import {
  login,
  register,
  refreshToken,
  get,
} from "../services/user-service.js";

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

const refreshTokenHandler = async (req, res, next) => {
  try {
    const result = await refreshToken(req.body.refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getUserHandler = async (req, res, next) => {
  try {
    const result = await get(req.user.username);
    res.status(200).json({
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register: registerHandler,
  login: loginUserHandler,
  refreshToken: refreshTokenHandler,
  get: getUserHandler,
};
