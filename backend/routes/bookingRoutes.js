const express = require('express');
const router = express.Router();
const bookingModel = require('../models/Booking'); 

router.get('/', async (req, res) => {
  try {
    const bookings = await bookingModel.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu đơn đặt phòng', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newBooking = await bookingModel.create(req.body);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: 'Tạo đơn đặt phòng thất bại', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await bookingModel.getById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy đơn đặt phòng', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await bookingModel.update(req.params.id, req.body);
    res.json({ message: 'Cập nhật đơn đặt phòng thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await bookingModel.delete(req.params.id);
    res.json({ message: 'Xoá đơn đặt phòng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá thất bại', error: err.message });
  }
});

module.exports = router;
