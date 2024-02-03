import mongoose, { ObjectId } from "mongoose";
import { IComment } from "./comment_model";

export interface IReview {
  _id?: ObjectId;
  movieTitle: string;
  description: string;
  score: number;
  reviewImgUrl: string;
  timeStamp: Date;
  owner: string;
  userFullName: string;
  userImgUrl: string;
  commentsCount: number;
  likesCount: number;
  isLiked: object[];
  comments?: IComment[];
}

const reviewSchema = new mongoose.Schema<IReview>({
  movieTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  reviewImgUrl: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  userFullName: {
    type: String,
    required: true,
  },
  userImgUrl: {
    type: String,
    required: true,
  },
  commentsCount: {
    type: Number,
    required: true,
  },
  likesCount: {
    type: Number,
    required: true,
  },
  isLiked: {
    type: [Object],
    required: true,
  },
  comments: {
    type: [Object],
    required: false,
  },
});

export default mongoose.model<IReview>("Review", reviewSchema);
