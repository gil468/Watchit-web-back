import Review, { IReview } from "../models/review_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class ReviewController extends BaseController<IReview> {
  constructor() {
    super(Review);
  }

  async get(req: AuthRequest, res: Response) {
    console.log("Get all Reviews: ");
    try {
      const reviews = await Review.find()
        .select("movieTitle description reviewImgUrl score timeStamp likes")
        .populate("author", "fullName imgUrl");
      const detailedReviews = reviews.map((review) => ({
        ...review.toObject(),
        isLiked: review.likes.includes(req.user._id),
        likesCount: review.likes.length,
      }));
      res.send(detailedReviews);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    console.log("Get Review by Id:" + req.params.id);
    super.getById(req, res);
  }

  async getByUserId(req: AuthRequest, res: Response) {
    console.log("Get Review by User Id:" + req.params.id);
    const owner = req.params.id;
    try {
      const reviews = await Review.find({ owner: owner });
      if (!reviews) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.status(201).send(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async post(req: AuthRequest, res: Response) {
    console.log("Post Review: " + req.body);
    const _id = req.user._id;
    req.body.author = _id;
    req.body.timeStamp = new Date();
    req.body.likes = [];

    super.post(req, res);
  }

  async putById(req: AuthRequest, res: Response) {
    console.log("Put Review by Id:" + req.params.id);
    super.putById(req, res);
  }

  async deleteById(req: AuthRequest, res: Response) {
    console.log("Delete Review by Id:" + req.params.id);
    super.deleteById(req, res);
  }
}

export default new ReviewController();
