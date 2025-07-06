import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
   
    const bearerHeader = req.headers['authorization'];
    const tokenFromHeader = bearerHeader && bearerHeader.split(' ')[1];
    const token = req.cookies?.accessToken || tokenFromHeader;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
      });
    }

 
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

   
    req.userId = decoded.userId;

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
