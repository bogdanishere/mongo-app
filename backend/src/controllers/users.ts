import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import assertIsDefined from "../utils/assertIsDefined";
import { SignUpBody, UpdateUserBody } from "../validation/users";
import sharp from "sharp";
import env from "../env";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUser = req.user;

  try {
    assertIsDefined(authenticatedUser);
    const user = await UserModel.findById(authenticatedUser._id)
      .select("+email")
      .exec();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// interface SignUpBody {
//   username: string;
//   email: string;
//   password: string;
// }

export const getUserByUsername: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      username: req.params.username,
    }).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password: passwordRaw } = req.body;

  try {
    const existingUsername = await UserModel.findOne({ username })
      .collation({
        locale: "en",
        strength: 2,
      })
      .exec();

    if (existingUsername) {
      throw createHttpError(409, "Username already taken");
    }
    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const result = await UserModel.create({
      username,
      displayName: username,
      email,
      password: passwordHashed,
    });

    const newUser = result.toObject();

    delete newUser.password;

    req.logIn(newUser, (error) => {
      if (error) throw error;
      res.status(201).json(newUser);
    });
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = (req, res) => {
  req.logOut((error) => {
    if (error) throw error;
    res.sendStatus(200);
  });
};

export const updateUser: RequestHandler<
  unknown,
  unknown,
  UpdateUserBody,
  unknown
> = async (req, res, next) => {
  const { username, displayName, about } = req.body;
  const profilePic = req.file;
  const authenticatedUser = req.user;

  try {
    assertIsDefined(authenticatedUser);

    if (username) {
      const existingUsername = await UserModel.findOne({ username })
        .collation({
          locale: "en",
          strength: 2,
        })
        .exec();

      if (existingUsername) {
        throw createHttpError(409, "Username already taken");
      }
    }

    let profilePicDestintionPath: string | undefined = undefined;

    if (profilePic) {
      profilePicDestintionPath =
        "/uploads/profile-pictures/" + authenticatedUser._id + ".png";
      await sharp(profilePic.buffer)
        .resize(500, 500, {
          withoutEnlargement: true,
        })
        .toFile("./" + profilePicDestintionPath);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      authenticatedUser._id,
      {
        $set: {
          ...(username && { username }),
          ...(displayName && { displayName }),
          ...(about && { about }),
          ...(profilePic && {
            profilePic:
              env.SERVER_URL +
              profilePicDestintionPath +
              "?lastupdated=" +
              Date.now(),
          }),
        },
      },
      { new: true }
    ).exec();

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
