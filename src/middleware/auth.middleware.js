import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import models from "../models/index.js";

const { User } = models;

const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request - no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findByPk(decoded.id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new ApiError(401, "Invalid access token - user no longer exists");
  }

  req.user = user;
  next();
});

export default verifyJWT;