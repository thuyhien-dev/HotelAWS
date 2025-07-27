require('dotenv').config();

const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const roomRoutes = require('./routes/roomRoutes');
const accountRoutes = require('./routes/accountRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const customerRoutes = require('./routes/customerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const bookingDetailRoutes = require('./routes/bookingDetailRoutes');

const cors = require('cors');
const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

app.use(express.json());
app.use(cors()); 
app.use('/api/auth', authRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bookingDetails', bookingDetailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`));
