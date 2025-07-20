const express = require('express');
const router = express.Router();
const customerModel = require('../models/Customer'); // Đường dẫn đúng với file model của bạn

// Lấy tất cả khách hàng
router.get('/', async (req, res) => {
  try {
    const customers = await customerModel.getAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: err.message });
  }
});

// Tạo mới khách hàng
router.post('/', async (req, res) => {
  try {
    const newCustomer = await customerModel.create(req.body);
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: 'Tạo khách hàng thất bại', error: err.message });
  }
});

// Lấy khách hàng theo ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerModel.getById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy khách hàng', error: err.message });
  }
});

// Cập nhật khách hàng
router.put('/:id', async (req, res) => {
  try {
    await customerModel.update(req.params.id, req.body);
    res.json({ message: 'Cập nhật khách hàng thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật khách hàng thất bại', error: err.message });
  }
});

// Xoá khách hàng
router.delete('/:id', async (req, res) => {
  try {
    await customerModel.delete(req.params.id);
    res.json({ message: 'Xoá khách hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá khách hàng thất bại', error: err.message });
  }
});

module.exports = router;
