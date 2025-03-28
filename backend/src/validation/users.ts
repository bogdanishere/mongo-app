import * as yup from "yup";
import { imageFileSchema } from "../utils/validation";

const usernameSchema = yup
  .string()
  .max(20)
  .matches(/^[a-zA-Z0-9_]*$/);

const emailSchema = yup.string().email();

const passwordSchema = yup
  .string()
  .matches(/^(?!.* )/)
  .min(6);

export const signUpSchema = yup.object({
  body: yup.object({
    username: usernameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
  }),
});

export type SignUpBody = yup.InferType<typeof signUpSchema>["body"];

export const updateUserSchema = yup.object({
  body: yup.object({
    username: usernameSchema,
    displayName: yup.string().max(20),
    about: yup.string().max(160),
  }),
  file: imageFileSchema,
});

export type UpdateUserBody = yup.InferType<typeof updateUserSchema>["body"];
