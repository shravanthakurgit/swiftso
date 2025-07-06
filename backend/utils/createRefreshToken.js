import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
const createRefreshToken = async (userId) => {
  const token= jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d"  })

  const updateUserRefreshToken = await userModel.updateOne(
    {_id: userId},
    { 
        refresh_token : token
    } )

    return token
  
};

export default createRefreshToken