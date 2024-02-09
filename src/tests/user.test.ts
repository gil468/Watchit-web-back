import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { IUser } from "../models/user_model";

let app: Express;
let accessTokenCookie = "";
let userId = "";

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
  const response = await request(app).post("/auth/register").send(user);
  accessTokenCookie = response.headers["set-cookie"][1]
    .split(",")
    .map((item) => item.split(";")[0])
    .join(";");
  userId = response.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Get connected user tests", () => {
  test("Should return 200 and the user data", async () => {
    const response = await request(app)
      .get("/users/connected")
      .send(userId)
      .set("Cookie", accessTokenCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("fullName");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("imgUrl");
  });
});

describe("Update user tests", () => {
  test("Should return 200 and the updated user data", async () => {
    const updatedUser = {
      fullName: "Jane Doe",
      email: "jane@student.com",
      imgUrl: "https://www.yahoo.com",
    };

    const response = await request(app)
      .put(`/users/`)
      .send(updatedUser)
      .set("Cookie", accessTokenCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("fullName", updatedUser.fullName);
    expect(response.body).toHaveProperty("email", updatedUser.email);
    expect(response.body).toHaveProperty("imgUrl", updatedUser.imgUrl);
  });
});
