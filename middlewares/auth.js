import jwt from "jsonwebtoken";
import { UnAuthenticatedError, UnAuthorizedError } from "../errors/index.js";

const verifyJWT = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Invalid Authentication header");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: payload.userId, isAdmin: payload.isAdmin };
  } catch (err) {
    throw new UnAuthenticatedError("Invalid token");
  }
};

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  req.userInfo = verifyJWT(authHeader);
  next();
};

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  req.userInfo = verifyJWT(authHeader);
  if (!req.userInfo.isAdmin) {
    throw new UnAuthorizedError("You are not an administrator");
  }

  next();
};

export { userAuth, adminAuth };
