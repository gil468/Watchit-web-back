import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Comment, { IComment } from "../models/comment_model";
import User, { IUser } from "../models/user_model";
import Review, { IReview } from "../models/review_model";

let app: Express;
let accessTokenCookie = "";

const user: IUser = {
  fullName: "John Doe",
  email: "john@student.com",
  password: "1234567890",
  imgUrl: "https://www.google.com",
};

const review: IReview = {
  movieTitle: "Test Movie",
  description: "Test Description",
  reviewImgUrl: "https://www.google.com",
  score: 5,
  timeStamp: new Date(),
  likes: [],
  comments: [],
  author: user._id,
};

const comment: IComment = {
  description: "test description",
  author: user._id,
  reviewId: review._id,
  timeStamp: new Date(),
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await User.deleteMany({ email: user.email });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  accessTokenCookie = response.headers["set-cookie"][1]
  .split(",")
  .map((item) => item.split(";")[0])
  .join(";");
  review.author = user._id;
  comment.author = user._id;
  await Review.create(review);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post comment test", () => {
  const addComment = async (comment: IComment) => {
    const response = await request(app)
      .post("/comments/")
      .set("Cookie", accessTokenCookie)
      .send(comment);
    expect(response.statusCode).toBe(201);
    expect(response.body.author).toBe(user._id);
    expect(response.body.description).toBe(comment.description);
    expect(response.body.reviewId).toBe(review._id);
  };

  test("Post comment test", async () => {
    await addComment(comment);
  });
});
