import { NextFunction, Request, Response } from "express";
import Category from "../models/category.model";
import { ApiError } from "../middleware/errorHandler";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(new ApiError(500, `Error fetching categories, ${error}`));
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ApiError(404, "Category not found"));

    res.status(200).json(category);
  } catch (error) {
    next(new ApiError(500, `Error fetching category, ${error}`));
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory)
      return next(new ApiError(404, "Category name already exists"));

    const newCategory = new Category({
      name,
      description,
    });

    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error) {
    next(new ApiError(500, `Error creating caetgory, ${error}`));
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) return next(new ApiError(404, "Category not found"));

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", data: category });
  } catch (error) {
    next(new ApiError(500, `Error update category, ${error}`));
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new ApiError(404, "Category not found"));

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
