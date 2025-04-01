const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId, todoId } = event.pathParameters;
    const { title, description, status } = JSON.parse(event.body);
    const updatedAt = new Date().toISOString();

    let updateExpression = 'SET updatedAt = :updatedAt';
    const expressionAttributeValues = {
      ':updatedAt': updatedAt
    };

    if (title) {
      updateExpression += ', title = :title';
      expressionAttributeValues[':title'] = title;
    }
    if (description) {
      updateExpression += ', description = :description';
      expressionAttributeValues[':description'] = description;
    }
    if (status) {
      updateExpression += ', status = :status';
      expressionAttributeValues[':status'] = status;
    }

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};