const express = require('express');
const router = express.Router();
const roomTypeModel = require('../models/RoomType'); 

// Lấy tất cả loại phòng
router.get('/', async (req, res) => {
  try {
    const roomTypes = await roomTypeModel.getAll();
    res.json(roomTypes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error: err.message });
  }
});

// Tạo mới loại phòng
router.post('/', async (req, res) => {
  try {
    const newRoomType = await roomTypeModel.create(req.body);
    res.status(201).json(newRoomType);
  } catch (err) {
    res.status(400).json({ message: 'Tạo loại phòng thất bại', error: err.message });
  }
});


// Lấy loại phòng theo ID
router.get('/:id', async (req, res) => {
  try {
    const roomType = await roomTypeModel.getById(req.params.id);
    if (!roomType) return res.status(404).json({ message: 'Không tìm thấy loại phòng' });
    res.json(roomType);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy loại phòng', error: err.message });
  }
});

// Cập nhật loại phòng
router.put('/:id', async (req, res) => {
  try {
    await roomTypeModel.update(req.params.id, req.body);
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});

// Xoá loại phòng
router.delete('/:id', async (req, res) => {
  try {
    await roomTypeModel.delete(req.params.id);
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá thất bại', error: err.message });
  }
});

module.exports = router;
