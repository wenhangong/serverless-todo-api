const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    const { userId, todoId } = event.pathParameters;
    
    const params = {
        TableName: TABLE_NAME,
        Key: { userId, todoId }
    };

    try {
        const result = await dynamodb.get(params).promise();
        if (!result.Item) {
            return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
        }
        return { statusCode: 200, body: JSON.stringify(result.Item) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Could not get todo" }) };
    }
};