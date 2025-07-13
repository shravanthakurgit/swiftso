import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const createRefreshToken = async (user) => {
 
  if (!user || !user._id || !user.email || !user.role) {
    throw new Error("Invalid user payload for refresh token");
  }

  const payload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(
    payload,
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d" }
  );

  // Save refresh token in DB
  await userModel.updateOne(
    { _id: user._id },
    { refresh_token: token }
  );

  return token;
};

export default createRefreshToken;
