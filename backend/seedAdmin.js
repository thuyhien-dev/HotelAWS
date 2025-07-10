require('dotenv').config()
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamodb = new AWS.DynamoDB.DocumentClient()

const TABLE_NAME = 'Accounts'
const COUNTER_TABLE = 'Counters' 

async function incrementCounter(counterId) {
  const params = {
    TableName: COUNTER_TABLE,
    Key: { counterId },
    UpdateExpression: "SET currentValue = currentValue + :inc",
    ExpressionAttributeValues: { ":inc": 1 },
    ReturnValues: "UPDATED_NEW",
  }

  const result = await dynamodb.update(params).promise()
  return result.Attributes.currentValue
}

async function seedAdmin() {
  const email = 'admin@gmail.com'
  const password = '123456a@A'
  const name = 'Admin'

  const accountId = await incrementCounter('Accounts')

  const hashedPassword = await bcrypt.hash(password, 10)

  const account = {
    accountId,  
    email,
    password: hashedPassword,
    name,
    role: 'admin',
  }

  await dynamodb.put({ TableName: TABLE_NAME, Item: account }).promise()
  console.log('Admin account seeded with accountId:', accountId)
}

seedAdmin().catch(console.error)
