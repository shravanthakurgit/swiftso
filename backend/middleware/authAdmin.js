import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization || req.headers.token;

  

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No Token Found!" });
    }

   
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing after split!" });
    }

 
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const allowedRoles = ['admin', 'manager'];
    const isEnvAdmin =
      decoded.email === process.env.ADMIN_EMAIL && decoded.role === 'admin';

    if (!allowedRoles.includes(decoded.role) && !isEnvAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized role" });
    }

    
    req.user = decoded;
    next();

  } catch (error) {
    console.error('[authAdmin error]', error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;
