import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();

userRouter.post("/auth/register", userController.register);
userRouter.post("/auth/login", userController.login);
userRouter.post("/auth/refresh", userController.refreshToken);
userRouter.get("/auth/profile", authMiddleware, userController.get);
userRouter.delete("/auth/logout", authMiddleware, userController.logout);
userRouter.patch("/auth/profile", authMiddleware, userController.update);

export default userRouter;
