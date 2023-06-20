import express from "express";

import {
  addPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.js";
import upload from "../helpers/imageUpload.js";
import auth from "../helpers/auth-jwt.js";

const router = express.Router();

router.post("/", auth, upload.single("image"), addPost);
router.get("/", getPosts);
router
  .route("/:id")
  .put(upload.single("image"), auth, updatePost)
  .delete(auth, deletePost);

export default router;
