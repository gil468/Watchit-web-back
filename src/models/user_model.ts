import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshTokens?: string[];
  imgUrl: String;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  imgUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("User", userSchema);
