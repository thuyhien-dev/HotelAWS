const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Rooms'

module.exports = {
  create: async (room) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.roomId > max ? item.roomId : max;
    }, 0);

    const newRoom = {
      ...room,
      roomId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newRoom,
    }).promise();

    return newRoom;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (roomId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { roomId: Number(roomId) }
    }).promise()
    return result.Item
  },

  update: async (roomId, updates) => {
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
      Key: { roomId: Number(roomId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (roomId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { roomId: Number(roomId) }
    }).promise()
  }
}
