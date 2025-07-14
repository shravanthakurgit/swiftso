import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'; // update path if needed

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization'];
    const tokenFromHeader = bearerHeader && bearerHeader.split(' ')[1];
    const token = req.cookies?.accessToken || tokenFromHeader;

    console.log("Authorization Header:", req.headers['authorization']);
console.log("Cookies:", req.cookies);


    if (!token) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
        token:req.cookies?.accessToken,
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.userId = decoded.userId;

    
    const user = await userModel.findById(decoded.userId)

    if (!user) {
      console.log(decoded)
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your account is currently ${user.status}.`,
      });
    }


    next();
  } catch (error) {
    console.error('[Auth Error]', error);
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

export default auth;
