import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { IUser } from "../models/user_model";
import Review, { IReview } from "../models/review_model";

let app: Express;
let accessTokenCookie = "";
let reviewId;

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
    console.log("accessTokenCookie", accessTokenCookie);
  review.author = user._id;
  const createdReview = await Review.create(review);
  reviewId = createdReview._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Get reviews test", () => {
  test("Should return 200 and the list of reviews", async () => {
    const response = await request(app)
      .get("/reviews/")
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("movieTitle", review.movieTitle);
    expect(response.body[0]).toHaveProperty("description", review.description);
    expect(response.body[0]).toHaveProperty(
      "reviewImgUrl",
      review.reviewImgUrl
    );
    expect(response.body[0]).toHaveProperty("score", review.score);
    expect(response.body[0]).toHaveProperty("likes", review.likes.length);
    expect(response.body[0]).toHaveProperty("isLiked", false);
  });
});

describe("Get review by id tests", () => {
  test("Should return 201 and the review", async () => {
    const response = await request(app)
      .get(`/reviews/${reviewId}`)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("movieTitle", review.movieTitle);
    expect(response.body).toHaveProperty("description", review.description);
    expect(response.body).toHaveProperty("reviewImgUrl", review.reviewImgUrl);
    expect(response.body).toHaveProperty("score", review.score);
    expect(response.body).toHaveProperty("likes", review.likes.length);
    expect(response.body).toHaveProperty("isLiked", false);
  });

  test("Should return 404 when review is not found", async () => {
    const response = await request(app)
      .get(`/reviews/60d6eb6b4d2f60001e680833`)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(404);
  });
});

describe("Like review tests", () => {
  test('Should return 201 and the message "Liked"', async () => {
    const response = await request(app)
      .post(`/reviews/like/${reviewId}`)
      .send(user)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Liked");
  });

  test('Should return 400 and the message "Already liked"', async () => {
    const response = await request(app)
      .post(`/reviews/like/${reviewId}`)
      .send(user)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Already liked");
  });

  test("Should return 404 when review is not found", async () => {
    const response = await request(app)
      .post(`/reviews/like/60d6eb6b4d2f60001e680833`)
      .send(user)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(404);
  });
});

describe("Unlike review tests", () => {
  test('Should return 201 and the message "Unliked"', async () => {
    // First, we need to like the review
    await request(app)
      .post(`/reviews/like/${reviewId}`)
      .send(user)
      .set("Cookie", accessTokenCookie)

    // Then, we can unlike it
    const response = await request(app)
      .post(`/reviews/unlike/${reviewId}`)
      .send(user)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Unliked");
  });

  test('Should return 400 and the message "Already unliked"', async () => {
    const response = await request(app)
      .post(`/reviews/unlike/${reviewId}`)
      .send(user)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Already unliked");
  });

  test("Should return 404 when review is not found", async () => {
    const response = await request(app)
      .post(`/reviews/unlike/60d6eb6b4d2f60001e680833`)
      .send(user)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(404);
  });
});

describe("Get reviews by connected user tests", () => {
  test("Should return 200 and the list of reviews by the connected user", async () => {
    const response = await request(app)
      .get("/reviews/connectedUser")
      .send(user)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("movieTitle", review.movieTitle);
    expect(response.body[0]).toHaveProperty("description", review.description);
    expect(response.body[0]).toHaveProperty(
      "reviewImgUrl",
      review.reviewImgUrl
    );
    expect(response.body[0]).toHaveProperty("score", review.score);
    expect(response.body[0]).toHaveProperty("likes", review.likes.length);
    expect(response.body[0]).toHaveProperty("isLiked", false);
  });

  test("Should return 401 when user is not authenticated", async () => {
    const response = await request(app)
      .get("/reviews/connectedUser")
      .send(null);
    expect(response.statusCode).toBe(401);
  });
});

describe("Post review tests", () => {
  test("Should return 201 and the created review", async () => {
    const response = await request(app)
      .post("/reviews")
      .send({ ...review, user })
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("movieTitle", review.movieTitle);
    expect(response.body).toHaveProperty("description", review.description);
    expect(response.body).toHaveProperty("reviewImgUrl", review.reviewImgUrl);
    expect(response.body).toHaveProperty("score", review.score);
    expect(response.body).toHaveProperty("likes", review.likes.length);
    expect(response.body).toHaveProperty("isLiked", false);
    expect(response.body).toHaveProperty("author", user._id.toString());
  });

  test("Should return error when review data is missing", async () => {
    const response = await request(app)
      .post("/reviews")
      .send({})
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).not.toBe(201);
  });

  test("Should return error when user is not authenticated", async () => {
    const response = await request(app).post("/reviews").send(review);
    expect(response.statusCode).not.toBe(201);
  });
});

describe("Put review by id tests", () => {
  test("Should return 200 and the updated review", async () => {
    const updatedReview: IReview = {
      ...review,
    };
    const response = await request(app)
      .put(`/reviews/${reviewId}`)
      .send(updatedReview)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(200);
  });

  test("Should return 400 when review data is missing", async () => {
    const response = await request(app)
      .put(`/reviews/${reviewId}`)
      .send({})
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).not.toBe(200);
  });

  test("Should return 401 when user is not authenticated", async () => {
    const response = await request(app)
      .put(`/reviews/${reviewId}`)
      .send(review);
    expect(response.statusCode).not.toBe(200);
  });

  test("Should return 404 when review is not found", async () => {
    const response = await request(app)
      .put(`/reviews/60d6eb6b4d2f60001e680833`)
      .send(review)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(404);
  });
});

describe("Delete review by id tests", () => {
  test("Should return 200 when review is successfully deleted", async () => {
    const response = await request(app)
      .delete(`/reviews/${reviewId}`)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).toBe(200);
  });

  test("Should return 401 when user is not authenticated", async () => {
    const response = await request(app).delete(`/reviews/${reviewId}`);
    expect(response.statusCode).not.toBe(200);
  });

  test("Should return 404 when review is not found", async () => {
    const response = await request(app)
      .delete(`/reviews/60d6eb6b4d2f60001e680833`)
      .set("Cookie", accessTokenCookie)
    expect(response.statusCode).not.toBe(200);
  });
});
