const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authController.changePassword);

router.get('/profile', async (req, res) => {
  const accountModel = require('../models/Account');
  const user = await accountModel.getByEmail(req.user.email);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

  delete user.password; 
  res.json({ user });
});

router.put('/update-profile', authController.updateProfile);

module.exports = router;
