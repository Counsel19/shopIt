import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a Name"],
      minlength: 3,
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Please provide a description"],
      minlength: 10,
    },

    image: {
      type: String,
      required: [true, "Please provide a category image"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
