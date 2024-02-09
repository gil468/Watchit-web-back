import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { IUser } from "../models/user_model";

let app: Express;
let accessTokenCookie = "";
let refreshTokenCookie = "";
let newRefreshTokenCookie = "";

const user: IUser = {
  fullName: "John Doe",
  email: "john@student.com",
  password: "1234567890",
  imgUrl: "https://www.google.com",
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(200);
  });

  test("Test Register exist email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "john@student.com",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Register missing email", async () => {
    const response = await request(app).post("/auth/register").send({
      password: "1234567890",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Register password incorrect", async () => {
    const response = await request(app).post("/auth/register").send({
      password: "123456",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Register email incorrect", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "john@t.com",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessTokenCookie = response.headers["set-cookie"][1]
      .split(",")
      .map((item) => item.split(";")[0])
      .join(";");
    refreshTokenCookie = response.headers["set-cookie"][0]
      .split(",")
      .map((item) => item.split(";")[0])
      .join(";");
    expect(accessTokenCookie).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/reviews/");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/reviews/")
      .set("Cookie", accessTokenCookie);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/reviews/")
      .set("Cookie", "1" + accessTokenCookie);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test("Test access after timeout of token", async () => {
    await new Promise((resolve) => setTimeout(() => resolve("done"), 5000));

    const response = await request(app)
      .get("/reviews/")
      .set("Cookie", accessTokenCookie);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Cookie", accessTokenCookie)
      .set("Cookie", refreshTokenCookie)
      .send();
    expect(response.statusCode).toBe(200);
    expect(accessTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();

    const newAccessTokenCookie = response.headers["set-cookie"][1]
      .split(",")
      .map((item) => item.split(";")[0])
      .join(";");
    newRefreshTokenCookie = response.headers["set-cookie"][0]
      .split(",")
      .map((item) => item.split(";")[0])
      .join(";");

    const response2 = await request(app)
      .get("/reviews/")
      .set("Cookie", newAccessTokenCookie);
    expect(response2.statusCode).toBe(200);
  });

  test("Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Cookie", refreshTokenCookie)
      .send();
    expect(response.statusCode).not.toBe(200);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get("/auth/refresh")
      .set("Cookie", newRefreshTokenCookie)
      .send();
    expect(response1.statusCode).not.toBe(200);
  });

  test("Test Logout", async () => {
    const response = await request(app).get("/auth/logout")
    .set("Cookie", refreshTokenCookie)
    expect(response.statusCode).toBe(200);
  });
});
