const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId, todoId } = event.pathParameters;

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        userId,
        todoId
      },
      ReturnValues: 'ALL_OLD'
    };

    const result = await dynamodb.delete(params).promise();

    if (!result.Attributes) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Todo not found' })
      };
    }

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({
        message: 'Todo deleted successfully',
        deletedItem: result.Attributes
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
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};