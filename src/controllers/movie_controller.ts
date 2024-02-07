import fetch from "node-fetch";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class MovieController {
  async search(req: AuthRequest, res: Response) {
    const searchTerm = req.params.search;

    try {
      const response = await fetch(
        `${process.env.MOVIE_API_URL}/search/movie?query=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${process.env.MOVIE_API_APP_KEY}` },
        }
      );
      const data = await response.json();

      res.status(200).send(data.results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    const movieId = req.params.movieId;

    try {
      const response = await fetch(
        `${process.env.MOVIE_API_URL}/movie/${movieId}`,
        {
          headers: { Authorization: `Bearer ${process.env.MOVIE_API_APP_KEY}` },
        }
      );
      const data = await response.json();

      res.status(200).send(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new MovieController();
