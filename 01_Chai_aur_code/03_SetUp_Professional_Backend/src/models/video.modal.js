import mongoose, { Schema } from "mongoose";
import mongooesAgregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true,
    },
    thumbnail: {
      type: String, // cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      lowercase: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

VideoSchema.plugin(mongooesAgregatePaginate); // use for  write agreegation quiery
export const VideoModel = mongoose.model("Video", VideoSchema);
