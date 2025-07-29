// routes/bookingDetails.js
const express = require('express');
const router = express.Router();
const bookingDetailModel = require('../models/BookingDetail');

// GET all
router.get('/', async (req, res) => {
  try {
    const data = await bookingDetailModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy booking details', error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const created = await bookingDetailModel.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: 'Thêm booking detail thất bại', error: err.message });
  }
});

// DELETE
router.delete('/', async (req, res) => {
  const { bookingId, serviceId } = req.query;

  try {
    if (!bookingId || !serviceId) {
      return res.status(400).json({ message: 'Thiếu bookingId hoặc serviceId để xoá' });
    }

    await bookingDetailModel.delete(Number(bookingId), Number(serviceId));
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá thất bại', error: err.message });
  }
});


module.exports = router;
