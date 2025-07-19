const express = require('express');
const router = express.Router();
const accountModel = require('../models/Account');

router.get('/', async (req, res) => {
  try {
    const accounts = await accountModel.getAll();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tài khoản', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newAccount = await accountModel.create(req.body);
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(400).json({ message: 'Tạo tài khoản thất bại', error: err.message });
  }
});

router.get('/:accountId', async (req, res) => {
  try {
    const accountId = Number(req.params.accountId);
    const account = await accountModel.getByAccountId(accountId);
    if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy tài khoản', error: err.message });
  }
});

router.put('/:accountId', async (req, res) => {
  try {
    const accountId = Number(req.params.accountId);
    const updatedAccount = await accountModel.update(accountId, req.body);
    res.json({ message: 'Cập nhật thành công', updatedAccount });
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});

router.delete('/:accountId', async (req, res) => {
  try {
    const accountId = Number(req.params.accountId);
    await accountModel.delete(accountId);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xóa thất bại', error: err.message });
  }
});

module.exports = router;
