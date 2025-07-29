const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Invoices'

module.exports = {
  create: async (invoice) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.invoiceId > max ? item.invoiceId : max;
    }, 0);

    const newInvoice = {
      ...invoice,
      invoiceId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newInvoice,
    }).promise();

    return newInvoice;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (invoiceId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { invoiceId: Number(invoiceId) }
    }).promise()
    return result.Item
  },

  update: async (invoiceId, updates) => {
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
      Key: { invoiceId: Number(invoiceId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (invoiceId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { invoiceId: Number(invoiceId) }
    }).promise()
  }
}
