import express from "express";
import userRouter from "../route/api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();
web.use(express.json());
web.use(userRouter);
web.use(errorMiddleware);
