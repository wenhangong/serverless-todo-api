const axios = require('axios');
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ACCESS_KEY_ID && {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
});

const API_URL = process.env.API_URL || 'http://localhost:3000';
jest.setTimeout(20000); // Increased timeout

describe('Todo API Integration Tests', () => {
  const testUserId = `testuser-${Date.now()}`;
  let createdTodoId;

  // Helper function with retry logic
  const makeRequest = async (method, endpoint, data = null, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const config = {
          method,
          url: `${API_URL}${endpoint}`,
          headers: { 'Content-Type': 'application/json' },
          ...(data && { data }),
          timeout: 5000
        };
        return await axios(config);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(res => setTimeout(res, 1000 * (i + 1)));
      }
    }
  };

  // Health check before running tests
  beforeAll(async () => {
    try {
      await makeRequest('get', '/health');
    } catch (error) {
      console.error('API is not available. Please ensure it is running.');
      throw error;
    }
  });

  test('Create Todo', async () => {
    const response = await makeRequest('post', '/todos', {
      userId: testUserId,
      title: 'Test Todo',
      description: 'Test Description'
    });
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('todoId');
    createdTodoId = response.data.todoId;
  });

  test('Get Todo', async () => {
    const response = await makeRequest('get', `/todos/${testUserId}/${createdTodoId}`);
    expect(response.status).toBe(200);
    expect(response.data.userId).toBe(testUserId);
    expect(response.data.todoId).toBe(createdTodoId);
  });

  test('List Todos', async () => {
    const response = await makeRequest('get', `/todos/${testUserId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.some(todo => todo.todoId === createdTodoId)).toBe(true);
  });

  test('Update Todo', async () => {
    const response = await makeRequest('put', `/todos/${testUserId}/${createdTodoId}`, {
      title: 'Updated Title',
      status: 'completed'
    });
    expect(response.status).toBe(200);
    expect(response.data.title).toBe('Updated Title');
    expect(response.data.status).toBe('completed');
  });

  test('Delete Todo', async () => {
    const response = await makeRequest('delete', `/todos/${testUserId}/${createdTodoId}`);
    expect(response.status).toBe(200);
    
    // Verify deletion
    await expect(makeRequest('get', `/todos/${testUserId}/${createdTodoId}`))
      .rejects.toMatchObject({
        response: { status: 404 }
      });
  });
});