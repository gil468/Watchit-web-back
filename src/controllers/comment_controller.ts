import Comment, { IComment } from "../models/comment_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }

  async get(req: AuthResquest, res: Response) {
    console.log("Get all Comments: ");
    super.get(req, res);
  }

  async getById(req: AuthResquest, res: Response) {
    console.log("Get Comment by Id:" + req.params.id);
    super.getById(req, res);
  }

  async post(req: AuthResquest, res: Response) {
    console.log("Post Comment: " + req.body);
    const _id = req.user._id;
    req.body.userId = _id;
    super.post(req, res);
  }

  async putById(req: AuthResquest, res: Response) {
    console.log("Put Comment by Id:" + req.params.id);
    super.putById(req, res);
  }

  async deleteById(req: AuthResquest, res: Response) {
    console.log("Delete Comment by Id:" + req.params.id);
    super.deleteById(req, res);
  }
}

export default new CommentController();
