import mongoose from "mongoose";

export interface IComment {
  description: string;
  userId: string;
}

const commentSchema = new mongoose.Schema<IComment>({
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IComment>("Comment", commentSchema);
