const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Bookings'

module.exports = {
  create: async (booking) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.bookingId > max ? item.bookingId : max;
    }, 0);

    const newBooking = {
      ...booking,
      bookingId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newBooking,
    }).promise();

    return newBooking;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (bookingId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { bookingId: Number(bookingId) }
    }).promise()
    return result.Item
  },

  update: async (bookingId, updates) => {
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
      Key: { bookingId: Number(bookingId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (bookingId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { bookingId: Number(bookingId) }
    }).promise()
  },
  count: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
    return result.Items.length;
  }
}
