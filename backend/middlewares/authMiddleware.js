const { supabase } = require('../config/supabase');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid or missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }

    // 2. Fetch role from our public.users table
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (dbError || !dbUser) {
      return res.status(401).json({ message: 'User not found in database' });
    }

    // Attach user payload to the request object
    req.user = { userId: user.id, role: dbUser.role };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
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
