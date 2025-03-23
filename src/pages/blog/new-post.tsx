import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as BlogApi from "@/network/api/blog";
import FormInputField from "@/components/form/FormInputField";
import MarkDownEditor from "@/components/form/MarkDownEditor";
import { generateSlug } from "@/utils/utils";

import LoadingButton from "@/components/LoadingButton";
import { useRouter } from "next/router";

import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  requiredFileSchema,
  slugSchema,
  validationStringSchema,
} from "@/utils/validation";

const validationSchema = yup.object({
  slug: slugSchema.required("Required"),
  title: validationStringSchema,
  summary: validationStringSchema,
  body: validationStringSchema,
  featuredImage: requiredFileSchema,
});

// interface CreatePostFormData {
//   slug: string;
//   title: string;
//   summary: string;
//   body: string;
//   featuredImage: FileList;
// }

type CreatePostFormData = yup.InferType<typeof validationSchema>;

export default function CreateBlogPostPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm<CreatePostFormData>({
    resolver: yupResolver(validationSchema),
  });
  async function onSubmit({
    title,
    slug,
    summary,
    featuredImage,
    body,
  }: CreatePostFormData) {
    try {
      await BlogApi.createBlogPost({
        title,
        slug,
        summary,
        body,
        featuredImage: featuredImage[0],
      });
      await router.push(`/blog/${slug}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    }
  }

  function generateSlugFromTitle() {
    if (getValues("slug")) return;
    const slug = generateSlug(getValues("title"));
    setValue("slug", slug, { shouldValidate: true });
  }

  return (
    <div>
      <h1>Create a new post</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* <FormInputField
          label="Post title"
          register={register("title", { required: "Required" })}
          placeholder="Post title"
          maxLength={100}
          error={errors.title}
          onBlur={generateSlugFromTitle}
        /> */}

        <FormInputField
          label="Post title"
          register={register("title")}
          placeholder="Post title"
          maxLength={100}
          error={errors.title}
          onBlur={generateSlugFromTitle}
        />

        <FormInputField
          label="Post slug"
          register={register("slug")}
          placeholder="Post slug"
          maxLength={100}
          error={errors.slug}
        />

        <FormInputField
          label="Post summary"
          register={register("summary")}
          placeholder="Post summary"
          as="textarea"
          maxLength={300}
          error={errors.summary}
        />

        <FormInputField
          label="Post image"
          register={register("featuredImage")}
          type="file"
          accept="image/png, image/jpg"
          error={errors.featuredImage}
        />

        <MarkDownEditor
          label="Post body"
          register={register("body")}
          watch={watch}
          setValue={setValue}
          error={errors.body}
        />

        {/* <Form.Group className="mb-3" controlId="body-input">
          <Form.Label>Post body</Form.Label>
          <Form.Control
            type="text"
            placeholder="Post body"
            as="textarea"
            // error={errors.body}
            {...register("body", { required: "Required" })}
          />
        </Form.Group> */}
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Create Post
        </LoadingButton>
      </Form>
    </div>
  );
}
