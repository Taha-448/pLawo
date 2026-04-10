const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid or missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user payload (e.g. { userId, role }) to the request object
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Requires Admin privileges' });
  }
  next();
};

module.exports = {
  authenticateUser,
  requireAdmin
};
