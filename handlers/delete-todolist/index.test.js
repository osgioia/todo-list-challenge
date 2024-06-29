const { handler } = require('./index'); 
const DeleteCommand = require('../../lib/delete-command');

jest.mock('../../lib/delete-command', () => jest.fn());

describe('handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a todo', async () => {
    const mockEvent = {
      queryStringParameters: {
        id: '1'
      }
    };

    const mockDeleteCommandResponse = { id: '1', title: 'Sample Todo', completed: true, metadata: 'Some metadata' };
    DeleteCommand.mockResolvedValue(mockDeleteCommandResponse);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockDeleteCommandResponse);
    expect(DeleteCommand).toHaveBeenCalledWith({
      TableName: process.env.TODOS_TABLE,
      Key: { id: '1' },
      ConditionExpression: 'attribute_exists(id) and completed = :completed',
      ExpressionAttributeValues: { ':completed': true }
    });
  });

  it('should handle missing id in query parameters', async () => {
    const mockEvent = {
      queryStringParameters: {}
    };

    const errorMessage = 'Either ID or Title must be provided.';
    const expectedErrorResponse = {
      message: errorMessage
    };

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual(expectedErrorResponse);
    expect(DeleteCommand).not.toHaveBeenCalled();
  });

});
