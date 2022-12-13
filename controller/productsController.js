import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import Product from "../models/Product.js";

const createProduct = async (req, res) => {
  const { name, desc, category, actualPrice, sellingPrice, images } = req.body;
  if (!name || !desc || !category || !actualPrice || !sellingPrice || !images) {
    throw new BadRequestError("Please provide all fields");
  }

  const foundProduct = await Product.find({ name, desc });
  if (foundProduct.length !== 0) {
    throw new BadRequestError("Product already exists");
  }

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json(product);
};
const getAllProduct = async (req, res) => {
  const products = await Product.find();

  const numOfProducts = await Product.countDocuments();

  res.status(StatusCodes.OK).json({ products, numOfProducts });
};

const updateProduct = async (req, res) => {};

const deleteProduct = async (req, res) => {};

export { createProduct, getAllProduct, updateProduct, deleteProduct };
