import express from "express";
const router = express.Router();
import WatchListController from "../controllers/watchlist_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/watchlists", WatchListController.get.bind(WatchListController));

router.get(
  "/watchlist:id",
  WatchListController.getById.bind(WatchListController)
);

router.post(
  "/watchlist",
  authMiddleware,
  WatchListController.post.bind(WatchListController)
);

router.put(
  "/watchlist:id",
  authMiddleware,
  WatchListController.putById.bind(WatchListController)
);

router.delete(
  "/watchlist:id",
  authMiddleware,
  WatchListController.deleteById.bind(WatchListController)
);

export default router;
