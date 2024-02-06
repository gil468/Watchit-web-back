import Review, { IReview } from "../models/review_model";
import Comment from "../models/comment_model";
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
        .select([
          "movieTitle",
          "description",
          "reviewImgUrl",
          "score",
          "timeStamp",
          "likes",
          "comments",
        ])
        .populate([{ path: "author", select: "fullName imgUrl" }])
        .sort({ timeStamp: -1 });
      const detailedReviews = reviews
        .map((review) => review.toObject())
        .map(({ _id, likes, ...review }) => ({
          ...review,
          id: _id,
          likes: likes.length,
          isLiked: likes.includes(req.user._id),
        }));

      res.send(detailedReviews);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    console.log("Get Review by Id:" + req.params.id);
    try {
      const review = await Review.findById(req.params.id)
        .populate([{ path: "author", select: "fullName imgUrl" }])
        .populate({
          path: "comments",
          select: "description timeStamp author reviewId",
          populate: { path: "author", select: "fullName imgUrl" },
        });
      if (!review) {
        res.status(404).json({ message: "Review not found" });
      }
      console.log(review);
      res.status(201).send(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  async like(req: AuthRequest, res: Response) {
    const reviewId = req.params.id;
    console.log("Like Review by Id:", reviewId);
    const userId = req.user._id;

    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (review.likes.includes(userId)) {
        return res.status(400).json({ message: "Already liked" });
      }

      review.likes.push(userId);
      await review.save();
      res.status(201).json({ message: "Liked" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Could not like review" });
    }
  }

  async unlike(req: AuthRequest, res: Response) {
    const reviewId = req.params.id;
    console.log("Unlike Review by Id:", reviewId);
    const userId = req.user._id;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!review.likes.includes(userId)) {
      return res.status(400).json({ message: "Already unliked" });
    }

    review.likes = review.likes.filter((id) => id !== userId);
    await review.save();
    res.status(201).json({ message: "Unliked" });
  }

  async getByConnectedUser(req: AuthRequest, res: Response) {
    console.log("Get Review by User Id:");

    const userId = req.user._id;
    console.log(userId);
    if (userId == null) return res.sendStatus(401);

    try {
      const reviews = await Review.find({ author: userId })
        .select([
          "movieTitle",
          "description",
          "reviewImgUrl",
          "score",
          "timeStamp",
          "likes",
          "comments",
        ])
        .populate([{ path: "author", select: "fullName imgUrl" }])
        .sort({ timeStamp: -1 });
      const detailedReviews = reviews
        .map((review) => review.toObject())
        .map(({ _id, likes, ...review }) => ({
          ...review,
          id: _id,
          likes: likes.length,
          isLiked: likes.includes(req.user._id),
        }));

      res.send(detailedReviews);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async post(req: AuthRequest, res: Response) {
    console.log("Post Review: " + req.body);
    const userId = req.user._id;
    req.body.author = userId;

    super.post(req, res);
  }

  async putById(req: AuthRequest, res: Response) {
    console.log("Put Review by Id:" + req.params.id);
    super.putById(req, res);
  }

  async deleteById(req: AuthRequest, res: Response) {
    try {
      await Comment.deleteMany({ reviewId: req.params.id });
    } catch (error) {
      res.status(500).json({ message: "Could not delete comments" });
    }
    console.log("Delete Review by Id:" + req.params.id);
    super.deleteById(req, res);
  }
}

export default new ReviewController();
