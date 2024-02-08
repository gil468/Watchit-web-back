import request from "supertest";
import initApp from "../app";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

describe("Search movie tests", () => {
  test("Should return 200 and the search results", async () => {
    const searchTerm = "The Matrix";

    const response = await request(app)
      .get(`/movies/search/${searchTerm}`)
      .set("Authorization", `Bearer ${process.env.MOVIE_API_APP_KEY}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("Get movie by id tests", () => {
  test("Should return 200 and the movie data", async () => {
    const movieId = "123"; // Replace with a valid movie id

    const response = await request(app)
      .get(`/movies/${movieId}`)
      .set("Authorization", `Bearer ${process.env.MOVIE_API_APP_KEY}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", movieId);
  });
});
