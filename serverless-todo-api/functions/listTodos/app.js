const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId } = event.pathParameters;
    const { status } = event.queryStringParameters || {};

    let params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    if (status) {
      params.IndexName = 'StatusIndex';
      params.KeyConditionExpression = 'userId = :userId and status = :status';
      params.ExpressionAttributeValues[':status'] = status;
    }

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({
        count: result.Count,
        items: result.Items
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