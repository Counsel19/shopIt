import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please provide your Full Name"],
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    require: [true, "Please provide a valid email"],
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email address`,
    },
    unique: true,
  },

  password: {
    type: String,
    minlength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, isAdmin: this.isAdmin },

    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
