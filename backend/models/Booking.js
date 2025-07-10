const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Bookings'

module.exports = {
  create: async (booking) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: booking }).promise()
  }
}
