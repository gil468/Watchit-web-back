import mongoose from "mongoose";

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  refreshTokens?: string[];
  profilePicture?: Buffer;
}

const userSchema = new mongoose.Schema<IUser>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
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
  profilePicture: {
    type: Buffer,
    required: false, //Need to be set to true
  }
});

export default mongoose.model<IUser>("User", userSchema);
