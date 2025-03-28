import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true, select: false },
    displayName: { type: String },
    about: { type: String },
    profilePic: { type: String },
    password: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true, select: false },
    githubId: { type: String, unique: true, sparse: true, select: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", function (next) {
  if (!this.email && !this.googleId && !this.githubId) {
    return next(
      new Error("At least one of email, googleId, or githubId must be provided")
    );
  }
  next();
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
