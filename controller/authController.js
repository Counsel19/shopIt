import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    throw new BadRequestError("Please provide all fields");
  }

  // Check if user is registered already
  const user = await User.findOne({ email });

  if (user) {
    throw new BadRequestError("Email Already Exists!");
  }

  const newUser = await User.create(req.body);

  const token = await newUser.createJWT();

  res.status(StatusCodes.CREATED).json({ newUser, token });
  next();
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Checking fields Availiability
  if (!email || !password) {
    throw new BadRequestError("Please provide all fields");
  }

  // Check if user is registered already
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnAuthenticatedError("Invalid Email");
  }

  // Copmare Passwords
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Password");
  }

  const token = await user.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
  next();
};

export { register, login };
