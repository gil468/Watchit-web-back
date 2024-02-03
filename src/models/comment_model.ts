import mongoose, { ObjectId }  from "mongoose";

export interface IComment {
  _id?: ObjectId;
  description: string;
  owner: string;
  reviewId: string;
  timeStamp: Date;
  userFullName: string;
  userImgUrl: string;
}

const commentSchema = new mongoose.Schema<IComment>({
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  reviewId: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
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
});

export default mongoose.model<IComment>("Comment", commentSchema);
