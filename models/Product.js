import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a Product Name"],
      minlength: 3,
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Please provide a product description"],
      minlength: 10,
    },

    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    actualPrice: {
      type: Number,
      required: [true, "Please provide an actual price"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Please provide an selling price"],
    },

    images: {
      type: Array,
      required: [true, "Please provide product images"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
