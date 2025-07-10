const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'RoomTypes'

module.exports = {
  create: async (roomType) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: roomType }).promise()
  }
}
