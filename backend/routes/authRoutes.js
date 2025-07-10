const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware, authController.changePassword);

router.get('/profile', authMiddleware, async (req, res) => {
  const accountModel = require('../models/Account');
  const user = await accountModel.getByEmail(req.user.email);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

  delete user.password; 
  res.json({ user });
});

router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;
