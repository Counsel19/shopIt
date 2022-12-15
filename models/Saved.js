import mongoose from "mongoose";

const SavedSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Please provide a product"],
    },
    quantity: {
      type: Number,
      default: 1,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Saved", SavedSchema);
