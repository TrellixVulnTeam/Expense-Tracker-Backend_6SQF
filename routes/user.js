import express from "express";
import userController from "../controllers/user.js";
import { z } from "zod";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    const signUpRequest = z.object({
      username: z.string().min(5),
      email: z.string().email(),
      password: z.string().min(8),
    });

    const { success, issues, error } = signUpRequest.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await userController.signUp(req, res);
  } catch (error) {
    console.log("Error in /user/signup route", error);
  }
});

userRouter.post("/signin", async (req, res, next) => {
  try {
    const signInRequest = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const { success, issues, error } = signInRequest.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await userController.signIn(req, res);
  } catch (error) {
    if (error) {
      console.log("Error in user/signin in route", error);
    }
  }
});

export default userRouter;
