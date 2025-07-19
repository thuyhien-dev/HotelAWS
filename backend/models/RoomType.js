const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'RoomTypes'

module.exports = {
  create: async (roomType) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.roomTypeId > max ? item.roomTypeId : max;
    }, 0);

    const newRoomType = {
      ...roomType,
      roomTypeId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newRoomType,
    }).promise();

    return newRoomType;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (roomTypeId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { roomTypeId: Number(roomTypeId) }
    }).promise()
    return result.Item
  },

  update: async (roomTypeId, updates) => {
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
      Key: { roomTypeId: Number(roomTypeId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (roomTypeId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { roomTypeId: Number(roomTypeId) }
    }).promise()
  }
}
