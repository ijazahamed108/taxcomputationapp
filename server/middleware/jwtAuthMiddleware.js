const jwt = require('jsonwebtoken')

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  };

  module.exports = {
    verifyToken
  }