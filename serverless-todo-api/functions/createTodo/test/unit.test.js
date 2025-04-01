const handler = require('../../app');
const AWS = require('aws-sdk-mock');

describe('CreateTodo', () => {
  beforeEach(() => {
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    AWS.restore();
  });

  test('should create a todo', async () => {
    const event = {
      body: JSON.stringify({
        userId: 'user1',
        title: 'Test Todo'
      })
    };

    const response = await handler.handler(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toHaveProperty('todoId');
  });
});