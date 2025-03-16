import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import validate from "../validation/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (request) => {
  const user = validate(registerUserValidation, request);
  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser > 0) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const result = await prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
      email: true,
    },
  });

  return {
    message: "User registered successfully",
    user: result,
  };
};

export const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Email or password is wrong");
  }

  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );

  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );

  await prismaClient.user.update({
    data: {
      refreshToken,
    },
    where: {
      email: user.email,
    },
  });

  return {
    message: "Login successfuly",
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (token) => {
  if (!token) {
    throw new ResponseError(401, "Refresh Token Required");
  }

  const existingUser = await prismaClient.user.findUnique({
    where: { refreshToken: token },
    select: { email: true },
  });

  if (!existingUser) {
    throw new ResponseError(403, "Invalid Refresh Token");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
      if (err) {
        reject(new ResponseError(403, "Invalid Refresh Token"));
      }

      const newAccessToken = jwt.sign(
        { email: user.email },
        process.env.ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
      );

      resolve({ accessToken: newAccessToken });
    });
  });
};

export const get = async (username) => {
  username = validate(getUserValidation, username);
  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User is not found");
  }
  return user;
};
