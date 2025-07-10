const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Counters'

module.exports = {
  create: async (item) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: item }).promise()
  }
}
