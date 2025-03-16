import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new ResponseError(401, "Access Token Required");
  }

  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) {
      throw new ResponseError(403, "Invalid or Expired Token");
    }
    req.user = user;
    next();
  });
};

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ errors: "Unauthorized", message: "Invalid credentials" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const user = await prismaClient.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res
        .status(403)
        .json({ errors: "Forbidden", message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ errors: "Forbidden", message: "Access denied" });
  }
};
