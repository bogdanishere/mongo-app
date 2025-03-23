import express from "express";
import * as BlogPostController from "../controllers/blog-post";
import { featureImageUpload } from "../middlewares/image-upload";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import {
  createBlogPostSchema,
  getBlogPostSchema,
} from "../validation/blog-posts";

const router = express.Router();

router.get(
  "/",
  validateRequestSchema(getBlogPostSchema),
  BlogPostController.getBlogPosts
);

router.get("/post/:slug", BlogPostController.getBlogPostBySlug);

router.get("/slugs", BlogPostController.getAllBlogPostsSlug);

// router.post(
//   "/",
//   requiresAuth,
//   featureImageUpload.single("featuredImage"),
//   BlogPostController.createBlogPost
// );

router.post(
  "/",
  requiresAuth,
  featureImageUpload.single("featuredImage"),
  validateRequestSchema(createBlogPostSchema),
  BlogPostController.createBlogPost
);

export default router;
