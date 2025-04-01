const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const { userId, title, description } = JSON.parse(event.body);
    
    // Validate input
    if (!userId || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'userId and title are required' })
      };
    }

    const todoId = uuidv4();
    const createdAt = new Date().toISOString();
    
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        userId,
        todoId,
        title,
        description: description || '',
        status: 'pending',
        createdAt,
        updatedAt: createdAt
      }
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        todoId,
        title,
        status: 'pending',
        createdAt
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message 
      })
    };
  }
};