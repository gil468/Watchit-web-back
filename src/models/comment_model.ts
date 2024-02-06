import mongoose, { ObjectId } from "mongoose";

export interface IComment {
  _id?: ObjectId;
  description: string;
  author: ObjectId;
  reviewId: ObjectId;
  timeStamp: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model<IComment>("Comment", commentSchema);
