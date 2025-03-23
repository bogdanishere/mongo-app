import mongoose from "mongoose";
import { validateBufferMIMEType } from "validate-image-type";
import * as yup from "yup";

export const imageFileSchema = yup
  .mixed<Express.Multer.File>()
  .test("valid-image", "File must be an image", async (file) => {
    if (!file) {
      return true;
    }

    const result = await validateBufferMIMEType(file.buffer, {
      allowMimeTypes: ["image/jpeg", "image/png"],
    });

    return result.ok;
  });

export const objectIdSchema = yup
  .string()
  .test("is-object-id", "${path} is not a valid objectId", (value) => {
    return !value || mongoose.Types.ObjectId.isValid(value);
  });
