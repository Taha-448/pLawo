const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// authenticateUser
// Reads the Bearer token from the Authorization header, verifies it with
// JWT, and attaches { userId, role } to req.user for downstream controllers.
// Replaces the old Supabase supabase.auth.getUser(token) call.
// ─────────────────────────────────────────────────────────────────────────────
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid or missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach same shape as before so all controllers work without changes
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication invalid or token expired' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// requireAdmin
// Middleware to restrict routes to ADMIN role only. Must run after
// authenticateUser so req.user is already populated.
// ─────────────────────────────────────────────────────────────────────────────
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Requires Admin privileges' });
  }
  next();
};

module.exports = { authenticateUser, requireAdmin };
