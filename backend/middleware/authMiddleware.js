const jwt = require('jsonwebtoken');
const JWT_SECRET = 'bb7c94804ace5645c903429dc198e0d7';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Không có token' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
