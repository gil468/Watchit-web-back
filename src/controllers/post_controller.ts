import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";

class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async get(req: AuthResquest, res: Response) {
    console.log("Get all Posts: ");
    super.get(req, res);
  }

  async getById(req: AuthResquest, res: Response) {
    console.log("Get Post by Id:" + req.params.id);
    super.getById(req, res);
  }

  async post(req: AuthResquest, res: Response) {
    console.log("Post a Post: " + req.body);
    const _id = req.user._id;
    req.body.userId = _id;
    super.post(req, res);
  }

  async putById(req: AuthResquest, res: Response) {
    console.log("Put Post by Id:" + req.params.id);
    super.putById(req, res);
  }

  async deleteById(req: AuthResquest, res: Response) {
    console.log("Delete Post by Id:" + req.params.id);
    super.deleteById(req, res);
  }
}

export default new PostController();
