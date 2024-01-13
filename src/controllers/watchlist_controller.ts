import WatchList, { IWatchList } from "../models/watchlist_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";

class WatchListController extends BaseController<IWatchList> {
  constructor() {
    super(WatchList);
  }

  async get(req: AuthResquest, res: Response) {
    console.log("Get all WatchLists: ");
    super.get(req, res);
  }

  async getById(req: AuthResquest, res: Response) {
    console.log("Get WatchList by Id:" + req.params.id);
    super.getById(req, res);
  }

  async post(req: AuthResquest, res: Response) {
    console.log("Post WatchList: " + req.body);
    const _id = req.user._id;
    req.body.userId = _id;
    super.post(req, res);
  }

  async putById(req: AuthResquest, res: Response) {
    console.log("Put WatchList by Id:" + req.params.id);
    super.putById(req, res);
  }

  async deleteById(req: AuthResquest, res: Response) {
    console.log("Delete WatchList by Id:" + req.params.id);
    super.deleteById(req, res);
  }
}

export default new WatchListController();
