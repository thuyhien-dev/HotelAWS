require('dotenv').config()
const express = require('express')
const AWS = require('aws-sdk')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'HotelManagement'

app.post('/api/customers', async (req, res) => {
  const { id, name, email } = req.body
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: `CUSTOMER#${id}`,
      SK: 'PROFILE',
      name,
      email,
    },
  }

  try {
    await dynamodb.put(params).promise()
    res.json({ message: 'Customer created' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.get('/api/customers/:id', async (req, res) => {
  const id = req.params.id
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `CUSTOMER#${id}`,
      SK: 'PROFILE',
    },
  }

  try {
    const result = await dynamodb.get(params).promise()
    res.json(result.Item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.listen(4000, () => {
  console.log('Backend running at http://localhost:4000')
})
