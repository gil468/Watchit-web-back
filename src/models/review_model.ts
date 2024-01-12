import mongoose from "mongoose";

export interface IReview {
  title: string;
  description: string;
  rating: number;
  userId: string;
}

const reviewSchema = new mongoose.Schema<IReview>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IReview>("Review", reviewSchema);
