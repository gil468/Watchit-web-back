import Comment, { IComment } from "../models/comment_model";
import Review from "../models/review_model";
import { BaseController } from "./base_controller";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }

  async get(req: AuthRequest, res: Response) {
    console.log("Get all Comments: ");
    super.get(req, res);
  }

  async getById(req: AuthRequest, res: Response) {
    console.log("Get Comment by Id:" + req.params.id);
    super.getById(req, res);
  }

  async getByReviewId(req: AuthRequest, res: Response) {
    console.log("Get Comments by Review Id:" + req.params.id);
    const reviewId = req.params.id;
    try {
      const comments = await Comment.find({ reviewId: reviewId });
      if (!comments) {
        return res.status(404).json({ message: "Comments was not found" });
      }
      res.status(201).send(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // async post(req: AuthRequest, res: Response) {
  //   console.log("Post Comment body: " + req.body);
  //   const _id = req.user._id;
  //   req.body.userId = _id;
  //   super.post(req, res);
  // }

  async post(req: AuthRequest, res: Response) {
    console.log("Post Comment body: " + req.body);
    try {
      await this.model.create(req.body);
    } catch (err) {
      console.log(err);
      res.status(406).send("fail: " + err.message);
    }
  }

  async postComment(req: AuthRequest, res: Response, next: NextFunction) {
    console.log("Post Comment: " + req.body);
    const { reviewId, description, userFullName, userImgUrl } = req.body;
    const owner = req.params.owner;
    
    try {
      const review = await Review.findOne({ _id: reviewId });
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      const newComment = new Comment({
        description,
        owner,
        reviewId,
        timeStamp: new Date(),
        userFullName,
        userImgUrl,
      });
      review.comments.push(newComment);
      await review.save();
      res.status(201).json({ message: "Comment added successfully", review });
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // async putById(req: AuthRequest, res: Response) {
  //   console.log("Put Comment by Id:" + req.params.id);
  //   super.putById(req, res);
  // }

  // async putCommentById(req: AuthRequest, res: Response) {
  //   const commentId = req.params.id;
  //   const { description, userFullName, userImgUrl } = req.body;
  //   const reviewId = req.params.reviewId;

  //   console.log("commentId: " + req.params.id)
  //   console.log("reviewId: " + reviewId)

  //   try {
  //     const review = await Review.findOneAndUpdate(
  //       { _id: reviewId, "comments._id": commentId },
  //       {
  //         $set: {
  //           "comments.$.description": description,
  //           "comments.$.userFullName": userFullName,
  //           "comments.$.userImgUrl": userImgUrl,
  //           "comments.$.timeStamp": new Date(),
  //         },
  //       },
  //       { new: true }
  //     );

  //     if (!review) {
  //       return res
  //         .status(404)
  //         .json({ message: "Review not found or Comment not in the review" });
  //     }
  //     res.status(200).json({ message: "Comment updated successfully", review });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  // async deleteById(req: AuthRequest, res: Response) {
  //   console.log("Delete Comment by Id:" + req.params.id);
  //   super.deleteById(req, res);
  // }

  // async deleteCommentById(req: AuthRequest, res: Response) {
  //   const commentId = req.params.id; 
  //   const reviewId = req.body.reviewId;

  //   try {
  //     const review = await Review.findByIdAndUpdate(
  //       reviewId,
  //       { $pull: { comments: { _id: commentId } } },
  //       { new: true }
  //     );

  //     if (!review) {
  //       return res.status(404).json({ message: 'Review not found or Comment not in the review' });
  //     }

  //     res.status(200).json({ message: 'Comment deleted successfully', review });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // }
}

export default new CommentController();
