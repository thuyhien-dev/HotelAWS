const express = require('express');
const router = express.Router();
const serviceModel = require('../models/Service');

// Lấy tất cả dịch vụ
router.get('/', async (req, res) => {
  try {
    const services = await serviceModel.getAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách dịch vụ', error: err.message });
  }
});
router.get('/count', async (req, res) => {
  try {
    const count = await serviceModel.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đếm dịch vụ', error: err.message });
  }
});
// Tạo mới dịch vụ
router.post('/', async (req, res) => {
  try {
    const newService = await serviceModel.create(req.body);
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: 'Tạo dịch vụ thất bại', error: err.message });
  }
});

// Lấy dịch vụ theo ID
router.get('/:id', async (req, res) => {
  try {
    const service = await serviceModel.getById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy dịch vụ', error: err.message });
  }
});

// Cập nhật dịch vụ
router.put('/:id', async (req, res) => {
  try {
    await serviceModel.update(req.params.id, req.body);
    res.json({ message: 'Cập nhật dịch vụ thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật dịch vụ thất bại', error: err.message });
  }
});

// Xoá dịch vụ
router.delete('/:id', async (req, res) => {
  try {
    await serviceModel.delete(req.params.id);
    res.json({ message: 'Xoá dịch vụ thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá dịch vụ thất bại', error: err.message });
  }
});




module.exports = router;
