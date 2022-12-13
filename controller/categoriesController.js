import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import Category from "../models/Category.js";

const createCategory= async (req, res) => {
  const { name, desc, image } = req.body;
  if (!name || !desc || !image) {
    throw new BadRequestError("Please provide all fields");
  }

  const foundCategory = await Category.find({ name, desc });
  if (foundCategory.length !== 0) {
    throw new BadRequestError("Category already exists");
  }

  const category = await Category.create(req.body);

  res.status(StatusCodes.CREATED).json(category);
};
const getAllCategory = async (req, res) => {
    const categories = await Category.find();

    const numOfCategories = await Category.countDocuments();
  
    res.status(StatusCodes.OK).json({ categories, numOfCategories });
};
const updateCategory = async (req, res) => {};
const deleteCategory = async (req, res) => {};

export { createCategory, getAllCategory, updateCategory, deleteCategory };
