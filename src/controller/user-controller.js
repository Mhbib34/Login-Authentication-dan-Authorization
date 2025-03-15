import { register } from "../services/user-service.js";

const registerHandler = async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  register: registerHandler,
};
