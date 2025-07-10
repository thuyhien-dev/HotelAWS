const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Customers'

module.exports = {
  create: async (customer) => {
    return dynamodb.put({ TableName: TABLE_NAME, Item: customer }).promise()
  }
}
