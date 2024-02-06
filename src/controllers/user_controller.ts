import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getConnected(req: AuthRequest, res: Response) {
    console.log("Get Connected User: ");
    const id = req.user._id;

    try {
      const user = await User.findById(id).select([
        "fullName",
        "email",
        "imgUrl",
      ]);
      res.send(user);
    } catch (err) {
      res.status(500).json({ message: "unable to retrieve user data" });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    console.log("Get User by Id:" + req.params.id);
    super.getById(req, res);
  }

  async post(req: AuthRequest, res: Response) {
    console.log("Post User: " + req.body);
    const _id = req.user._id;
    req.body.userId = _id;
    super.post(req, res);
  }

  async putById(req: AuthRequest, res: Response) {
    console.log("Put User");
    const id = req.user._id;

    try {
      const obj = await this.model.findByIdAndUpdate(id, req.body);
      res.status(200).send(obj);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new UserController();
