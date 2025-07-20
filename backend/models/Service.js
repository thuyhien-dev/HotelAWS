const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Services'

module.exports = {
  create: async (service) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.serviceId > max ? item.serviceId : max;
    }, 0);

    const newService = {
      ...service,
      serviceId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newService,
    }).promise();

    return newService;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (serviceId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { serviceId: Number(serviceId) }
    }).promise()
    return result.Item
  },

  update: async (serviceId, updates) => {
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
      Key: { serviceId: Number(serviceId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (serviceId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { serviceId: Number(serviceId) }
    }).promise()
  }
}
