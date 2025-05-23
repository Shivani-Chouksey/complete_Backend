import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {timestamps: true}
);

export const CategoryModel = mongoose.model("Category", CategorySchema);
