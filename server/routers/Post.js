import express from "express";
import {
  createPost,
  getAllPosts,
  likePost,
  unLikePost,
  newComment,
  getPostComments
} from "../controllers/Post.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/createpost").post(isAuthenticated, createPost);

router.route("/getallposts").get(getAllPosts);

router.route("/getpostcomments/:_id").get(getPostComments);

router.route("/like/:_id").put(isAuthenticated, likePost);

router.route("/unlike/:_id").put(isAuthenticated, unLikePost);

router.route("/newcomment").post(isAuthenticated, newComment);

export default router;