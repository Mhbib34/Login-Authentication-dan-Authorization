import express from "express";
import userRouter from "../route/api.js";

export const web = express();
web.use(express.json());
web.use(userRouter);
