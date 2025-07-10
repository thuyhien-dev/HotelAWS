const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Invoices'

module.exports = {
  create: async (invoice) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: invoice }).promise()
  }
}
