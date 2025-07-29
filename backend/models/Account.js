const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Accounts';

module.exports = {
  create: async (account) => {
    const existingItems = await dynamodb.scan({ TableName: TABLE_NAME }).promise();

    const maxId = existingItems.Items.reduce((max, item) => {
      return item.accountId > max ? item.accountId : max;
    }, 0);

    const newAccount = {
      ...account,
      accountId: maxId + 1,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newAccount,
    }).promise();

    return newAccount;
  },

  getAll: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise()
    return result.Items
  },

  getById: async (accountId) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { accountId: Number(accountId) }
    }).promise()
    return result.Item
  },

  update: async (accountId, updates) => {
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
      Key: { accountId: Number(accountId) },
      UpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()
  },

  delete: async (accountId) => {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { accountId: Number(accountId) }
    }).promise()
  },

  getByAccountId: async (accountId) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { accountId },
    };
    const result = await dynamodb.get(params).promise();
    return result.Item;
  },
  getByEmail: async (email) => {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };
    const result = await dynamodb.scan(params).promise();
    return result.Items[0];
  },

  update: async (accountId, updates) => {
    const updateExpressions = [];
    const ExpressionAttributeValues = {};
    const ExpressionAttributeNames = {};

    if ('accountId' in updates) {
      delete updates.accountId;
    }

    for (const key in updates) {
      const safeKey = key === 'role' ? '#role' : `#${key}`;
      updateExpressions.push(`${safeKey} = :${key}`);
      ExpressionAttributeValues[`:${key}`] = updates[key];
      ExpressionAttributeNames[safeKey] = key;
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { accountId: Number(accountId) },
      UpdateExpression: `set ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  },
  count: async () => {
    const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
    return result.Items.length;
  }

};
