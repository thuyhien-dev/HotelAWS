const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Services'

module.exports = {
  create: async (service) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: service }).promise()
  }
}
