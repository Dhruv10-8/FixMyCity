const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  let token;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];  // Get the token part after "Bearer"
  }
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;  // Attach the decoded user info to the request object
    // console.log("Decoded User:", req.user);  // You can remove this in production
    next();  // Move to the next middleware/route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (req.user.role===role || req.user.role==='admin'){
    return next()
  }
  else {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
