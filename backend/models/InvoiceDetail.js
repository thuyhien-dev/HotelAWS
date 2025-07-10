const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'InvoiceDetails'

module.exports = {
  create: async (detail) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: detail }).promise()
  }
}
