const express = require('express');
const router = express.Router();
const invoiceModel = require('../models/Invoice');

const crypto = require('crypto');
let id = 0;
const config = {
  vnp_TmnCode: '0S7T01T8',
  vnp_HashSecret: 'BEZLUPOPOTXTDYZHCBGDJBHFJPBLSARL',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'http://localhost:5000/api/invoices/vnpay/return',
};

function getRandomNumber(length = 8) {
  let result = '';
  const characters = '0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function formatDateTimeGMT7(date) {
  const GMT7Offset = 7 * 60;
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const gmt7Date = new Date(utc + (GMT7Offset * 60000));

  const pad = (n) => n.toString().padStart(2, '0');
  return `${gmt7Date.getFullYear()}${pad(gmt7Date.getMonth() + 1)}${pad(gmt7Date.getDate())}${pad(gmt7Date.getHours())}${pad(gmt7Date.getMinutes())}${pad(gmt7Date.getSeconds())}`;
}

function encodeVNPay(value) {
  return encodeURIComponent(value).replace(/%20/g, '+');
}

router.post('/vnpay/create', async (req, res) => {
  try {
    const { amount, id } = req.body;
    this.id = id;
    const vnp_TxnRef = getRandomNumber(8);

    const vnp_TmnCode = config.vnp_TmnCode;
    const vnp_Version = "2.1.0";
    const vnp_Command = "pay";
    const vnp_IpAddr = "127.0.0.1";
    const vnp_CurrCode = "VND";
    const vnp_BankCode = "NCB";
    const vnp_OrderInfo = `Thanh toán đơn mã #${vnp_TxnRef}`;
    const vnp_OrderType = "other";
    const vnp_Locale = "vn";
    const vnp_ReturnUrl = config.vnp_ReturnUrl;

    const now = new Date();
    const vnp_CreateDate = formatDateTimeGMT7(now);

    const expireDateObj = new Date(now.getTime() + 15 * 60 * 1000);
    const vnp_ExpireDate = formatDateTimeGMT7(expireDateObj);

    const vnp_Params = {
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_Amount: (amount * 100).toString(),
      vnp_CurrCode,
      vnp_BankCode,
      vnp_TxnRef,
      vnp_OrderInfo,
      vnp_OrderType,
      vnp_Locale,
      vnp_ReturnUrl,
      vnp_IpAddr,
      vnp_CreateDate,
      vnp_ExpireDate
    };

    Object.keys(vnp_Params).forEach(key => {
      if (!vnp_Params[key]) delete vnp_Params[key];
    });

    const sortedKeys = Object.keys(vnp_Params).sort();

    let hashData = '';
    let query = '';

    sortedKeys.forEach((key, index) => {
      const value = vnp_Params[key];
      const encodedKey = encodeVNPay(key);
      const encodedValue = encodeVNPay(value);

      hashData += `${encodedKey}=${encodedValue}`;
      query += `${encodedKey}=${encodedValue}`;
      if (index < sortedKeys.length - 1) {
        hashData += '&';
        query += '&';
      }
    });

    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const vnp_SecureHash = hmac.update(hashData).digest('hex');

    const paymentUrl = `${config.vnp_Url}?${query}&vnp_SecureHash=${vnp_SecureHash}`;
    res.json({ paymentUrl });
  } catch (error) {
    console.error("Lỗi tạo thanh toán VNPAY:", error);
    res.status(500).json({ message: 'Lỗi tạo thanh toán', error: error.message });
  }
});

const bookingModel = require('../models/Booking');

router.get('/vnpay/return', async (req, res) => {
  try {
    const vnp_Params = { ...req.query };
    const bookingId = this.id;

    if (!bookingId) {
      return res.status(400).send('Không tìm thấy id tương ứng!');
    }
    const totalAmount = Number(vnp_Params['vnp_Amount']) / 100;

    await bookingModel.update(bookingId, { paymentStatus: "Hoàn thành" });

    const newInvoice = {
      bookingId,
      createdAt: new Date().toISOString(),
      totalAmount,
    };

    await invoiceModel.create(newInvoice);

    res.redirect('http://localhost:3000/admin/booking?message=' + encodeURIComponent('Thanh toán thành công!'));

  } catch (error) {
    console.error('Lỗi xử lý callback VNPAY:', error);
    res.status(500).send('Lỗi server khi xử lý thanh toán');
  }
});



router.get('/', async (req, res) => {
  try {
    const invoices = await invoiceModel.getAll();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy hoá đơn', error: err.message });
  }
});
router.get('/total-revenue', async (req, res) => {
  try {
    const invoices = await invoiceModel.getAll();
    const total = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    res.json({ totalRevenue: total });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tính tổng doanh thu', error: error.message });
  }
});
router.get('/monthly-revenue', async (req, res) => {
  try {
    const invoices = await invoiceModel.getAll();
    const currentYear = moment().year();

    let revenueByMonth = Array(12).fill(0);

    invoices.forEach(inv => {
      const createdAt = moment(inv.createdAt);
      if (createdAt.year() === currentYear) {
        const month = createdAt.month(); // 0 - 11
        revenueByMonth[month] += inv.totalAmount || 0;
      }
    });

    const result = revenueByMonth.map((revenue, index) => ({
      month: index + 1,
      revenue,
    }));

    res.json(result);
  } catch (error) {
    console.error("Lỗi lấy doanh thu theo tháng:", error);
    res.status(500).json({ message: "Lỗi lấy doanh thu theo tháng", error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const invoice = await invoiceModel.getById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Không tìm thấy hoá đơn' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy hoá đơn', error: err.message });
  }
});

const moment = require('moment');

router.get('/weekly-revenue', async (req, res) => {
  try {
    const invoices = await invoiceModel.getAll();

    const startOfWeek = moment().startOf('isoWeek');
    const endOfWeek = moment().endOf('isoWeek');

    let weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(startOfWeek.clone().add(i, 'days'));
    }

    const revenueByDay = weekDates.map(date => {
      const totalForDay = invoices
        .filter(inv => {
          const createdAt = moment(inv.createdAt);
          return createdAt.isSame(date, 'day');
        })
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

      return {
        date: date.format('YYYY-MM-DD'),
        revenue: totalForDay,
      };
    });

    res.json(revenueByDay);
  } catch (error) {
    console.error('Lỗi lấy doanh thu tuần:', error);
    res.status(500).json({ message: 'Lỗi lấy doanh thu tuần', error: error.message });
  }
});




module.exports = router;
