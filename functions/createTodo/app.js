const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { title, userId } = JSON.parse(event.body);
  const todoId = Date.now().toString();
  
  await dynamodb.put({
    TableName: process.env.TABLE_NAME,
    Item: { userId, todoId, title, status: "pending" }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({ todoId, title })
  };
};