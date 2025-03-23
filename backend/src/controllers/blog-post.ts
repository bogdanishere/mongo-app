import { RequestHandler } from "express";
import BlogPostModel from "../models/blog-post";
import assertIsDefined from "../utils/assertIsDefined";
import mongoose from "mongoose";
import sharp from "sharp";
import env from "../env";
import createHttpError from "http-errors";
import { BlogPostBody, GetBlogPostQuery } from "../validation/blog-posts";

export const getBlogPosts: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetBlogPostQuery
> = async (req, res, next) => {
  const authorId = req.query.authorId;

  const filter = authorId ? { author: authorId } : {};

  try {
    const allBlogPosts = await BlogPostModel.find(filter)
      .sort({ _id: -1 })
      .populate("author")
      .exec();
    res.status(200).json(allBlogPosts);
  } catch (error) {
    next(error);
  }
};

// interface BlogPostBody {
//   slug: string;
//   title: string;
//   summary: string;
//   body: string;
// }

export const getBlogPostBySlug: RequestHandler = async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findOne({
      slug: req.params.slug,
    })
      .populate("author")
      .exec();

    console.log(blogPost);
    if (!blogPost) {
      throw createHttpError(404, "No blog post found for this slug");
    }
    res.status(200).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const getAllBlogPostsSlug: RequestHandler = async (req, res, next) => {
  try {
    const allBlogPosts = await BlogPostModel.find().select("slug").exec();
    const slugs = allBlogPosts.map((post) => post.slug);
    res.status(200).json(slugs);
  } catch (error) {
    next(error);
  }
};

export const createBlogPost: RequestHandler<
  unknown,
  unknown,
  BlogPostBody,
  unknown
> = async (req, res, next) => {
  const { slug, title, summary, body } = req.body;
  const featuredImage = req.file;
  const authenticatedUser = req.user;

  try {
    assertIsDefined(featuredImage);
    assertIsDefined(authenticatedUser);

    const existingSlug = await BlogPostModel.findOne({ slug }).exec();

    if (existingSlug) {
      throw createHttpError(409, "Slug already taken. PLease try another one");
    }

    const blogPostId = new mongoose.Types.ObjectId();

    const featuredImageDestinationPath =
      "/uploads/featured-images/" + blogPostId + ".png";
    await sharp(featuredImage.buffer)
      .resize(700, 450)
      .toFile("./" + featuredImageDestinationPath);

    const newPost = await BlogPostModel.create({
      _id: blogPostId,
      slug,
      title,
      summary,
      body,
      featuredImageUrl: env.SERVER_URL + featuredImageDestinationPath,
      author: authenticatedUser._id,
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};
