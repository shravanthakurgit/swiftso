import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
    // Get token from Authorization header or token header
    const authHeader = req.headers.authorization || req.headers.token;

    console.log("Authorization Header:", authHeader); // Debug

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No Token Found!" });
    }

    // Extract Bearer token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing after split!" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    // Check allowed roles
    const allowedRoles = ['admin', 'manager'];
    const isEnvAdmin =
      decoded.email === process.env.ADMIN_EMAIL && decoded.role === 'admin';

    if (!allowedRoles.includes(decoded.role) && !isEnvAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized role" });
    }

    // Attach decoded payload
    req.user = decoded;
    next();

  } catch (error) {
    console.error('[authAdmin error]', error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;
