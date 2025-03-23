import { BlogPost } from "@/models/blog-post";
import axiosInstance from "../axiosInstance";

export async function getBlogPosts() {
  const response = await axiosInstance.get<BlogPost[]>("/posts");
  return response.data;
}

export async function getBlogPostsByUser(userId: string) {
  const response = await axiosInstance.get<BlogPost[]>(
    `/posts?authorId=${userId}`
  );
  return response.data;
}

interface CreateBlogPostValues {
  slug: string;
  title: string;
  summary: string;
  body: string;
  featuredImage: File;
}

export async function getAllBlogPostsSlug() {
  const response = await axiosInstance.get<string[]>("/posts/slugs");
  return response.data;
}

export async function getBlogPostBySlug(slug: string) {
  const response = await axiosInstance.get<BlogPost>(`/posts/post/${slug}`);
  return response.data;
}

export async function createBlogPost(input: CreateBlogPostValues) {
  const formData = new FormData();

  Object.entries(input).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await axiosInstance.post<BlogPost>("/posts", formData);
  return response.data;
}
