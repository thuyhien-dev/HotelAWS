const accountModel = require('../models/Account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'bb7c94804ace5645c903429dc198e0d7';

module.exports = {
  register: async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email và password là bắt buộc' });

    const existing = await accountModel.getByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await accountModel.create({ email, password: hashedPassword, name });

    res.json({ message: 'Đăng ký thành công' });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await accountModel.getByEmail(email);
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  },

  changePassword: async (req, res) => {
    const email = req.user.email;
    const { oldPassword, newPassword } = req.body;

    try {
      const user = await accountModel.getByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'User không tồn tại' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const accountId = user.accountId;

      await accountModel.update(accountId, { password: hashedNewPassword });

      res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi đổi mật khẩu' });
    }
  },


  updateProfile: async (req, res) => {
    const email = req.user.email;
    const updates = req.body;

    try {
      const user = await accountModel.getByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      const accountId = user.accountId;

      const updatedUser = await accountModel.update(accountId, updates);
      res.json({ message: 'Cập nhật thành công', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi cập nhật' });
    }
  }

};
