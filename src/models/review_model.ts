import mongoose, { ObjectId } from "mongoose";

export interface IReview {
  _id?: ObjectId;
  movieTitle: string;
  description: string;
  score: number;
  reviewImgUrl: string;
  author: ObjectId;
  timeStamp: Date;
  likes: string[];
  isLiked?: boolean;
  likesCount?: number;
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timeStamp: {
    type: Date,
    required: true,
  },
  likes: {
    type: [String],
    required: true,
  },
});

export default mongoose.model<IReview>("Review", reviewSchema);
