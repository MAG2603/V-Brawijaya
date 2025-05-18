import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { ApiError } from "../middleware/errorHandler";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return next(new ApiError(404, "User not found"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ApiError(401, "Invalid credential"));

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
