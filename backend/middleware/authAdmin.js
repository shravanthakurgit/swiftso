import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No Token Found!" });
    }

  
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  console.log(decoded) 

   
    if (decoded.email !== process.env.ADMIN_EMAIL || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    
    req.userId = decoded;
    console.log(decoded)

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};


export default authAdmin;
