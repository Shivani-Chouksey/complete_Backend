import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const playlistModel = mongoose.model("Playlist", playlistSchema);
