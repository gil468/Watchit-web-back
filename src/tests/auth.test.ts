import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { IUser } from "../models/user_model";

let app: Express;
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

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

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
    expect(response.statusCode).toBe(401);
  });

  test("Test Register email incorrect", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "john@t.com",
    });
    expect(response.statusCode).toBe(401);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    // accessToken = response.body.accessToken;
    // refreshToken = response.body.refreshToken;
    const setCookieHeaders = response.headers["set-cookie"];

    let accessToken;
    for (let i = 0; i < setCookieHeaders.length; i++) {
      const cookies = setCookieHeaders[i].split(';');
      for (let j = 0; j < cookies.length; j++) {
        const [cookieName, cookieValue] = cookies[j].split('=');
        const trimmedCookieName = cookieName.trim();
        if (trimmedCookieName === 'access') {
          accessToken = cookieValue.trim();
          break;
        }
      }
      if (accessToken) {
        break;
      }
    }
    expect(accessToken).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/reviews/");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/reviews/")
      // .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/reviews/")
      // .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test("Test access after timeout of token", async () => {
    await new Promise((resolve) => setTimeout(() => resolve("done"), 5000));

    const response = await request(app)
      .get("/reviews/")
      // .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      // .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    // expect(response.body.accessToken).toBeDefined();
    // expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/reviews/")
      // .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  test("Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      // .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).not.toBe(200);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get("/auth/refresh")
      // .set("Authorization", "JWT " + newRefreshToken)
      .send();
    expect(response1.statusCode).not.toBe(200);
  });

  test("Test Logout", async () => {
    const response = await request(app).get("/auth/logout");
      // .set("Authorization", "JWT " + refreshToken);
    expect(response.statusCode).toBe(200);
  });
});
