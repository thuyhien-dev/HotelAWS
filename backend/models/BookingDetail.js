const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'BookingDetails'

module.exports = {
  create: async (bookingDetail) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.bookingDetailId > max ? item.bookingDetailId : max;
    }, 0);

    const newBookingDetail = {
      ...bookingDetail,
      bookingDetailId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newBookingDetail,
    }).promise();

    return newBookingDetail;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (bookingDetailId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { bookingDetailId: Number(bookingDetailId) }
    }).promise()
    return result.Item
  },

  update: async (bookingDetailId, updates) => {
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
      Key: { bookingDetailId: Number(bookingDetailId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (bookingId, serviceId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: {
        bookingId: Number(bookingId),
        serviceId: Number(serviceId),
      },
    }).promise();
  }

}
