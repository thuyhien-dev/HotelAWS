const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const roomModel = require('../models/Room');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const upload = multer({ storage: multer.memoryStorage() });

async function uploadToS3(file) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `rooms/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location; 
}

router.get('/', async (req, res) => {
  try {
    const rooms = await roomModel.getAll();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy phòng', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const room = await roomModel.getById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy phòng', error: err.message });
  }
});

router.post('/', upload.single('img'), async (req, res) => {
  try {
    const roomData = req.body;

    if (req.file) {
      const imgUrl = await uploadToS3(req.file);
      roomData.img = imgUrl;
    }

    const newRoom = await roomModel.create(roomData);
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: 'Tạo phòng thất bại', error: err.message });
  }
});

router.put('/:id', upload.single('img'), async (req, res) => {
  try {
    const updates = req.body;

    updates.floor = parseInt(updates.floor);
    updates.roomTypeId = parseInt(updates.roomTypeId);

    if (isNaN(updates.floor) || isNaN(updates.roomTypeId)) {
      return res.status(400).json({ message: "Tầng và loại phòng phải là số." });
    }

    if (!updates.status) {
      return res.status(400).json({ message: "Trạng thái là bắt buộc." });
    }

    if (req.file) {
      const imgUrl = await uploadToS3(req.file);
      updates.img = imgUrl;
    }

    await roomModel.update(req.params.id, updates);
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    console.error("PUT /rooms error:", err);
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await roomModel.delete(req.params.id);
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá thất bại', error: err.message });
  }
});

module.exports = router;
