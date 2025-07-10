require('dotenv').config();

const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
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




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`));
