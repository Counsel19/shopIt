import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthorizedError } from "../errors/index.js";
import Saved from "../models/Saved.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const createSaved = async (req, res) => {
  const { productId } = req.body;
  console.log(productId, "Product");
  //check for product ID
  if (!productId) {
    console.log("How!!!")
    throw new BadRequestError("Please provide productId ");
  }

  const createdBy = req.userInfo.userId;

  const newSaved = await Saved.create({ ...req.body, createdBy });
  res.status(StatusCodes.CREATED).json(newSaved);
};

const getUserSaveds = async (req, res) => {
  let userSaveds = await Saved.find({ createdBy: req.userInfo.userId });
  const numOfSaveds = await Saved.countDocuments({
    createdBy: req.userInfo.userId,
  });

  userSaveds = await Promise.all(
    userSaveds.map(async (savedItem) => {
      const { name, actualPrice, sellingPrice, category } =
        await Product.findById(savedItem.productId);
      const categoryName = await Category.findById(category);
      return {
        productInfo: {
          name,
          actualPrice,
          sellingPrice,
          categoryName: categoryName.name,
        },
        ...savedItem._doc,
      };
    })
  );

  res.status(StatusCodes.OK).json({ userSaveds, numOfSaveds });
};
const updateSaved = async (req, res) => {
  const { savedId } = req.params;

  const victimSaved = await Saved.findById(savedId);

  if (
    JSON.stringify(victimSaved.createdBy).slice(1, -1) !== req.userInfo.userId
  ) {
    throw new UnAuthorizedError(" You cannot Update This Saved!!! ");
  }

  const updatedSaved = await Saved.findOneAndUpdate(
    { _id: savedId, createdBy: req.userInfo.userId },
    { ...req.body },
    {
      new: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({ updatedSaved, msg: "Saved Item Succesfully Updated" });
};
const deleteSaved = async (req, res) => {
  const { savedId } = req.params;

  const victimSaved = await Saved.findById(savedId);
  if (victimSaved) {
    if (
      JSON.stringify(victimSaved.createdBy).slice(1, -1) !== req.userInfo.userId
    ) {
      throw new UnAuthorizedError(" You cannot Delete This Saved!!! ");
    }

    await Saved.findOneAndDelete({
      _id: savedId,
      createdBy: req.userInfo.userId,
    });

    res.status(StatusCodes.OK).json({ msg: "Saved Item Succesfully Deleted" });
  } else {
    throw new BadRequestError("Invalid Saved Id");
  }
};

export { createSaved, getUserSaveds, updateSaved, deleteSaved };
