const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Customers'

module.exports = {
  create: async (customer) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.customerId > max ? item.customerId : max;
    }, 0);

    const newCustomer = {
      ...customer,
      customerId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newCustomer,
    }).promise();

    return newCustomer;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (customerId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { customerId: Number(customerId) }
    }).promise()
    return result.Item
  },

  update: async (customerId, updates) => {
    const updateExpressions = []
    const expressionAttributeNames = {}
    const expressionAttributeValues = {}

    for (const key in updates) {
      updateExpressions.push(`#${key} = :${key}`)
      expressionAttributeNames[`#${key}`] = key
      expressionAttributeValues[`:${key}`] = updates[key]
    }

    const UpdateExpression = 'SET ' + updateExpressions.join(', ')

    await dynamodb.update({
      TableName: TABLE_NAME,
      Key: { customerId: Number(customerId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (customerId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { customerId: Number(customerId) }
    }).promise()
  }
}
