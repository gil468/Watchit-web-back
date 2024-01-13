import mongoose from "mongoose";
import { IComment } from "./comment_model";

export interface IPost {
  reviewId: string;
  userId: string;
  uploadTime: Date;
  lastUpdateTime: Date;
  comments: IComment[];
  numberOfLikes: number;
}

const postSchema = new mongoose.Schema<IPost>({
  reviewId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  uploadTime: {
    type: Date,
    required: true,
  },
  lastUpdateTime: {
    type: Date,
    required: true,
  },
  comments: {
    type: [Object], // I don't know if its working as well
    required: true,
  },
  numberOfLikes: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IPost>("Post", postSchema);
