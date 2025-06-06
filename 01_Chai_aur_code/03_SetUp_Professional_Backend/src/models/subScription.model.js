import mongoose, { Schema } from "mongoose";

const subScriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // one to whom 'sucscriber 'is subscribing
      ref: "User",
    },
  },
  { timestamps: true }
);

export const subScriptionModel = mongoose.model(
  "Subscription",
  subScriptionSchema
);
