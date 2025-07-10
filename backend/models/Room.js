const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Rooms'

module.exports = {
  create: async (room) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: room }).promise()
  }
}
