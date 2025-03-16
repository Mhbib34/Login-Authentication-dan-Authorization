import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new ResponseError(401, "Access Token Required");
  }

  jwt.verify(token, "ACCESS_SECRET", (err, user) => {
    if (err) {
      throw new ResponseError(403, "Invalid or Expired Token");
    }
    req.user = user;
    next();
  });
};
