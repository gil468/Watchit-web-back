import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";
import reviewRoute from "./routes/review_route";
import commentRoute from "./routes/comment_route";
import movieRoute from "./routes/movie_route";
import fileRoute from "./routes/file_route";
var cors = require("cors");

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const dbUrl = process.env.DB_URL;
    mongoose.connect(dbUrl!).then(() => {
      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      const corsOptions = {
        origin: `http://localhost:${process.env.FRONTEND_PORT}`,
        credentials: true,
      };
      app.use(cors(corsOptions));
      app.use(cookieParser());
      app.use("/auth", authRoute);
      app.use("/users", userRoute);
      app.use("/reviews", reviewRoute);
      app.use("/comments", commentRoute);
      app.use("/movies", movieRoute);
      app.use("/public", express.static("public"));
      app.use("/file", fileRoute);

      resolve(app);
    });
  });
  return promise;
};

export default initApp;
