import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { ApiError } from "../middleware/errorHandler";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(new ApiError(500, `Error fetching users, ${error}`));
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(new ApiError(404, `User not found`));

    res.status(200).json(user);
  } catch (error) {
    next(new ApiError(500, `Error fetching user, ${error}`));
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullname, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return next(new ApiError(500, `User not found`));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(new ApiError(500, `Error creating user, ${error}`));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullname, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return next(new ApiError(404, `User not found`));

    if (fullname) user.fullname = fullname;
    if (password) user.password = await bcrypt.hash(password, 8);

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(new ApiError(500, `Error updating user, ${error}`));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new ApiError(404, `User not found`));

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(new ApiError(500, `Error deleting user, ${error}`));
  }
};
