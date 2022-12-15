import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import User from "../models/User.js";


const getAllUsers = async (req, res) => {
    const users = await User.find();

    const numOfUsers= await User.countDocuments();
  
    res.status(StatusCodes.OK).json({ users, numOfUsers });
};
const updateUser = async (req, res) => {};
const deleteUser = async (req, res) => {};

export { getAllUsers, updateUser, deleteUser };
