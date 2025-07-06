import jwt from 'jsonwebtoken'

const createAccessToken = async (userId) => {
  const token = await jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '7h' });
  return token
};
export default createAccessToken;