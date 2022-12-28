import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import Category from "../models/Category.js";
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
  let queryObject = {};

  const { search, sort, filter } = req.query;
  console.log(filter, "filter")

  if (filter && filter !== "all") {
    const category = await Category.findOne({ name: filter });
    console.log(category, "category")

    queryObject = { ...queryObject, category: category._id };
  }

  if (search) {
    const fieldsToSearch = ["name", "desc"];

    const query = {
      $or: [
        ...fieldsToSearch.map((field) => ({
          [field]: new RegExp("^" + search, "i"),
        })),
      ],
    };
    queryObject = { ...queryObject, ...query };
  }

  let result = Product.find(queryObject);

  // CHAIN SORT
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("name");
  }
  if (sort === "z-a") {
    result = result.sort("-name");
  }

  const allProducts = await result;

  const products = await Promise.all(
    allProducts.map(async (product) => {
      const category = await Category.findById(product.category);
      return {
        _id: product._id,
        name: product.name,
        sellingPrice: product.sellingPrice,
        actualPrice: product.actualPrice,
        image: product.images[0],
        category: category.name,
      };
    })
  );

  const numOfProducts = await Product.countDocuments(queryObject);

  res.status(StatusCodes.OK).json({ products, numOfProducts });
};

const getSingleProduct = async (req, res) => {
  const { productId } = req.params;

  const singlePoduct = await Product.findById(productId);

  res.status(StatusCodes.OK).json(singlePoduct);
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    req.body,
    {
      new: true,
    }
  );

  res.status(StatusCodes.OK).json(updatedProduct);
};

const deleteProduct = async (req, res) => {};

export {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};
