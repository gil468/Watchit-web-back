import mongoose from "mongoose";

export interface IWatchList {
  title: string;
  movies: string[]; // TO-Change: Should be a array of movies from the external api
  userId: string;
}

const watchListSchema = new mongoose.Schema<IWatchList>({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: [String],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IWatchList>("WatchList", watchListSchema);
