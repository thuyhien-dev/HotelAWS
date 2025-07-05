require('dotenv').config()
const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamodb = new AWS.DynamoDB()

const tables = [
  {
    TableName: 'Accounts',
    KeySchema: [{ AttributeName: 'accountId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'accountId', AttributeType: 'N' }],
  },
  {
    TableName: 'Customers',
    KeySchema: [{ AttributeName: 'customerId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'customerId', AttributeType: 'N' }],
  },
  {
    TableName: 'RoomTypes',
    KeySchema: [{ AttributeName: 'roomTypeId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'roomTypeId', AttributeType: 'N' }],
  },
  {
    TableName: 'Rooms',
    KeySchema: [{ AttributeName: 'roomId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'roomId', AttributeType: 'N' }],
  },
  {
    TableName: 'Services',
    KeySchema: [{ AttributeName: 'serviceId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'serviceId', AttributeType: 'N' }],
  },
  {
    TableName: 'Bookings',
    KeySchema: [{ AttributeName: 'bookingId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'bookingId', AttributeType: 'N' }],
  },
  {
    TableName: 'BookingDetails',
    KeySchema: [
      { AttributeName: 'bookingId', KeyType: 'HASH' },
      { AttributeName: 'serviceId', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'bookingId', AttributeType: 'N' },
      { AttributeName: 'serviceId', AttributeType: 'N' },
    ],
  },
  {
    TableName: 'Invoices',
    KeySchema: [{ AttributeName: 'invoiceId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'invoiceId', AttributeType: 'N' }],
  },
  {
    TableName: 'InvoiceDetails',
    KeySchema: [
      { AttributeName: 'invoiceId', KeyType: 'HASH' },
      { AttributeName: 'serviceId', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'invoiceId', AttributeType: 'N' },
      { AttributeName: 'serviceId', AttributeType: 'N' },
    ],
  },
  {
    TableName: 'Counters',
    KeySchema: [{ AttributeName: 'counterId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'counterId', AttributeType: 'S' }],
  },
]

const createTables = async () => {
  for (const table of tables) {
    const params = {
      ...table,
      BillingMode: 'PAY_PER_REQUEST',
    }

    try {
      const exists = await dynamodb
        .describeTable({ TableName: table.TableName })
        .promise()
      console.log(`✅ Table "${table.TableName}" already exists.`)
    } catch (err) {
      if (err.code === 'ResourceNotFoundException') {
        console.log(`🚧 Creating table: ${table.TableName}`)
        await dynamodb.createTable(params).promise()
        console.log(`✅ Created table: ${table.TableName}`)
      } else {
        console.error(`❌ Error checking table "${table.TableName}":`, err)
      }
    }
  }
}

createTables()
