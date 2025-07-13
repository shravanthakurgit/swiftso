import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const createAccessToken = async (user) => {
  if (!user || !user._id || !user.role || !user.email) {
    throw new Error("Invalid user payload for token");
  }

  const payload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  return jwt.sign(
    payload,
    process.env.ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '7h' }
  );
};

export default createAccessToken;