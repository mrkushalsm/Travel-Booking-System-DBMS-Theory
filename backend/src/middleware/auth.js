const jwt = require('jsonwebtoken');
const env = require('../config/env');

const auth = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || req.cookies?.token;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication token missing' });
    }

    try {
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
      const decoded = jwt.verify(token, env.jwt.secret);
      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
};

module.exports = auth;
