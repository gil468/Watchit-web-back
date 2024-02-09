import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose, { ObjectId } from "mongoose";
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
  accessTokenCookie = response.headers["set-cookie"][1]
    .split(",")
    .map((item) => item.split(";")[0])
    .join(";");
  const postedUser = await User.findOne({ email: user.email });
  user._id = postedUser.id;
  review.author = postedUser.id;
  comment.author = postedUser.id;
  const postedReview = await Review.create(review);
  review._id = postedReview._id;
  comment.reviewId = postedReview._id;
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
    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.author).toBe(user._id);
    expect(response.body.description).toBe(comment.description);
    expect(response.body.reviewId).toBe(review._id.toString());
  };

  test("Post comment test", async () => {
    await addComment(comment);
  });
});
