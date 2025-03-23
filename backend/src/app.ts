import "dotenv/config";
import express from "express";
import BlogPostRoutes from "./routes/blog-posts";
import usersRoutes from "./routes/users";
import cors from "cors";
import env from "./env";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";
import createHttpError from "http-errors";
import session from "express-session";
import sessionConfig from "./config/session";
import passport from "passport";
import "./config/passport";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(
  cors({
    origin: env.WEBSITE_URL,
    credentials: true,
  })
);

app.use(session(sessionConfig));

app.use(passport.authenticate("session"));

app.use("/uploads/featured-images", express.static("uploads/featured-images"));
app.use(
  "/uploads/profile-pictures",
  express.static("uploads/profile-pictures")
);

app.use("/users", usersRoutes);
app.use("/posts", BlogPostRoutes);

app.use((req, res, next) => next(createHttpError(404, "Endpoint Not Found")));

app.use(errorHandler);

export default app;
