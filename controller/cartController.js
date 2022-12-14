import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthorizedError } from "../errors/index.js";
import Cart from "../models/Cart.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const createCart = async (req, res) => {
  const { productId } = req.body;
  //check for product ID
  if (!productId) {
    throw new BadRequestError("Please provide productId ");
  }

  const createdBy = req.userInfo.userId;

  const newCart = await Cart.create({ ...req.body, createdBy });
  res.status(StatusCodes.CREATED).json(newCart);
};

const getUserCarts = async (req, res) => {
  let cart = await Cart.find({ createdBy: req.userInfo.userId });
  const numOfCart = await Cart.countDocuments({
    createdBy: req.userInfo.userId,
  });

  let subTotal = 0

  cart = await Promise.all(
    cart.map(async (cartItem) => {
      const { name, actualPrice, images, sellingPrice, category } =
        await Product.findById(cartItem.productId);
      const categoryName = await Category.findById(category);
      subTotal = subTotal + sellingPrice * cartItem.quantity
      return {
        productInfo: {
          name,
          actualPrice,
          sellingPrice,
          image: images[0],
          categoryName: categoryName.name,
        },
        ...cartItem._doc,
      };
    })
  );

  res.status(StatusCodes.OK).json({ cart, numOfCart, subTotal });
};
const updateCart = async (req, res) => {
  const { cartId } = req.params;

  const victimCart = await Cart.findById(cartId);

  if (
    JSON.stringify(victimCart.createdBy).slice(1, -1) !== req.userInfo.userId
  ) {
    throw new UnAuthorizedError(" You cannot Update This Cart!!! ");
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { _id: cartId, createdBy: req.userInfo.userId },
    { ...req.body },
    {
      new: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({ updatedCart, msg: "Cart Item Succesfully Updated" });
};
const deleteCart = async (req, res) => {
  const { cartId } = req.params;

  const victimCart = await Cart.findById(cartId);
  if (victimCart) {
    if (
      JSON.stringify(victimCart.createdBy).slice(1, -1) !== req.userInfo.userId
    ) {
      throw new UnAuthorizedError(" You cannot Delete This Cart!!! ");
    }

    await Cart.findOneAndDelete({
      _id: cartId,
      createdBy: req.userInfo.userId,
    });

    res.status(StatusCodes.OK).json({ msg: "Cart Item Succesfully Deleted" });
  } else {
    throw new BadRequestError("Invalid Cart Id");
  }
};

export { createCart, getUserCarts, updateCart, deleteCart };
