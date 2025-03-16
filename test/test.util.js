import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestUser = async () => {
  const refreshToken = jwt.sign(
    { email: "test@gmail.com" },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );

  await prismaClient.user.create({
    data: {
      username: "test",
      name: "test",
      password: await bcrypt.hash("rahasia", 10),
      email: "test@gmail.com",
      refreshToken,
    },
  });
};

export const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "test",
    },
  });
};
