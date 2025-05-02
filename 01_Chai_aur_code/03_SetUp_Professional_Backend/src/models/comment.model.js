import mongoose, { Schema } from "mongoose";
import mongooseAgreegatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content: {
      type: String,
    },
    owner: {
      type: Schema.types.ObjectId,
      ref: "User",
    },
    video: {
      type: Schema.types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAgreegatePaginate);
export const commentModel = Schema.model("Comment", commentSchema);
