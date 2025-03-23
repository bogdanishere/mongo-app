import * as yup from "yup";

export const validationStringSchema = yup
  .string()
  .required("This field is required");

export const usernameSchema = yup
  .string()
  .max(20, "Must be 20 characters or less")
  .matches(
    /^[a-zA-Z0-9_]*$/,
    "Only letters, numbers, and underscores are allowed"
  );

export const emailSchema = yup.string().email("Invalid email address");

export const passwordSchema = yup
  .string()
  .matches(/^(?!.* )/, "No spaces allowed")
  .min(6, "Must be at least 6 characters");

export const slugSchema = yup
  .string()
  .matches(/^[a-zA-Z0-9-]+$/, "No special characters allowed or spaces");

export const requiredFileSchema = yup
  .mixed<FileList>()
  .test(
    "not-emply-file-list",
    "Required file",
    (value) => value instanceof FileList && value.length > 0
  )
  .required();
