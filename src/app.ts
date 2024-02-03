import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";
import reviewRoute from "./routes/review_route";
import commentRoute from "./routes/comment_route";
import movieRoute from "./routes/movie_route";
import fileRoute from "./routes/file_route";

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
      });
      app.use(cookieParser());
      app.use("/auth", authRoute);
      app.use("/users", userRoute);
      app.use("/reviews", reviewRoute);
      app.use("/comments", commentRoute);
      app.use("/movies", movieRoute);
      app.use("/public", express.static("public"));
      app.use("/file", fileRoute);

      // app.use("/auth", authRoute);
      resolve(app);
    });
  });
  return promise;
};

export default initApp;
