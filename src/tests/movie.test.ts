import request from "supertest";
import initApp from "../app";
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

describe("Search movie tests", () => {
  test("Should return 200 and the search results", async () => {
    const searchTerm = "The Matrix";

    const response = await request(app)
      .get(`/movies/search/${searchTerm}`)
      .set("Cookie", accessTokenCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("Get movie by id tests", () => {
  test("Should return 200 and the movie data", async () => {
    const movieId = 695721;

    const response = await request(app)
      .get(`/movies/${movieId}`)
      .set("Cookie", accessTokenCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", movieId);
  });
});
