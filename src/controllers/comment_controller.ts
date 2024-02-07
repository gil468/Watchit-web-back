import Comment, { IComment } from "../models/comment_model";
import Review from "../models/review_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }

  async post(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const { description, reviewId } = req.body;

      const review = await Review.findById(reviewId);
      if (!review) {
        res.status(404).json({ message: "Review not found" });
      }

      const comment = await Comment.create({
        description,
        author: userId,
        reviewId: review.id,
      });

      review.comments.push(comment.id);

      await review.save();
      res.status(201).json({ message: "Comment created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new CommentController();
