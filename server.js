import express from "express";
const app = express();

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

import "express-async-errors";
import cors from "cors";

let corsOptions = {
  origin: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

import morgan from "morgan";
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

import connectDb from "./db/connect.js";
import dotenv from "dotenv";
dotenv.config();

// Routes
import AuthRoute from "./routes/authRoute.js";
import ProductRoute from "./routes/productRoute.js";
import CategoryRoute from "./routes/categoryRoute.js";
import CartRoute from "./routes/cartRoute.js";
import UserRoute from "./routes/userRoute.js";
import SavedRoute from "./routes/savedRoute.js";

// middlewares
import ErrorHandlerMiddleware from "./middlewares/Errorhandler.js";
app.use(express.json());

app.use("/api/auth/", AuthRoute);
app.use("/api/products/", ProductRoute);
app.use("/api/categories/", CategoryRoute);
app.use("/api/carts/", CartRoute);
app.use("/api/saved/", SavedRoute);
app.use("/api/users/", UserRoute);

app.use(ErrorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    console.log("Connected to Database");
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();


