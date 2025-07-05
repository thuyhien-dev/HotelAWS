// backend/seedData.js
require('dotenv').config()
const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamodb = new AWS.DynamoDB.DocumentClient()

const seed = async () => {
  try {
    // Counters
    const counters = [
      { counterId: 'Accounts', currentValue: 1000 },
      { counterId: 'Customers', currentValue: 1000 },
      { counterId: 'RoomTypes', currentValue: 10 },
      { counterId: 'Rooms', currentValue: 100 },
      { counterId: 'Services', currentValue: 100 },
      { counterId: 'Bookings', currentValue: 1000 },
      { counterId: 'BookingDetails', currentValue: 0 },
      { counterId: 'Invoices', currentValue: 2000 },
      { counterId: 'InvoiceDetails', currentValue: 0 },
    ]

    for (const item of counters) {
      await dynamodb.put({ TableName: 'Counters', Item: item }).promise()
    }

    // Customers
    await dynamodb.put({
      TableName: 'Customers',
      Item: {
        customerId: 1001,
        name: 'Nguyễn Văn A',
        phone: '0987654321',
        email: 'nva@gmail.com',
        createdAt: new Date().toISOString(),
      },
    }).promise()

    // RoomTypes
    const roomTypes = [
      { roomTypeId: 1, name: 'VIP', description: 'Phòng VIP đầy đủ tiện nghi', pricePerNight: 1500000 },
      { roomTypeId: 2, name: 'Standard', description: 'Phòng tiêu chuẩn cho 2 người', pricePerNight: 800000 },
    ]
    for (const item of roomTypes) {
      await dynamodb.put({ TableName: 'RoomTypes', Item: item }).promise()
    }

    // Rooms
    const rooms = [
      { roomId: 101, roomTypeId: 1, status: 'available', floor: 1 },
      { roomId: 102, roomTypeId: 2, status: 'occupied', floor: 1 },
    ]
    for (const item of rooms) {
      await dynamodb.put({ TableName: 'Rooms', Item: item }).promise()
    }

    // Services
    const services = [
      { serviceId: 201, name: 'Giặt ủi', price: 30000, unit: 'lần' },
      { serviceId: 202, name: 'Bữa sáng', price: 50000, unit: 'suất' },
    ]
    for (const item of services) {
      await dynamodb.put({ TableName: 'Services', Item: item }).promise()
    }

    // Bookings
    await dynamodb.put({
      TableName: 'Bookings',
      Item: {
        bookingId: 3001,
        customerId: 1001,
        roomId: 101,
        checkInDate: '2025-07-05',
        checkOutDate: '2025-07-07',
        status: 'active',
      },
    }).promise()

    // BookingDetails
    const bookingDetails = [
      { bookingId: 3001, serviceId: 201, quantity: 2 },
      { bookingId: 3001, serviceId: 202, quantity: 1 },
    ]
    for (const item of bookingDetails) {
      await dynamodb.put({ TableName: 'BookingDetails', Item: item }).promise()
    }

    // Invoices
    await dynamodb.put({
      TableName: 'Invoices',
      Item: {
        invoiceId: 4001,
        bookingId: 3001,
        totalAmount: 3150000,
        createdAt: new Date().toISOString(),
      },
    }).promise()

    // InvoiceDetails
    const invoiceDetails = [
      { invoiceId: 4001, serviceId: 201, quantity: 2, unitPrice: 30000 },
      { invoiceId: 4001, serviceId: 202, quantity: 1, unitPrice: 50000 },
    ]
    for (const item of invoiceDetails) {
      await dynamodb.put({ TableName: 'InvoiceDetails', Item: item }).promise()
    }

    console.log('✅ Dữ liệu demo đã được nhập thành công.')
  } catch (err) {
    console.error('❌ Lỗi khi nhập dữ liệu:', err)
  }
}

seed()
