const { handler } = require('./index'); 
const PutCommand = require('../../lib/put-command');

jest.mock('../../lib/put-command', () => jest.fn());

describe('handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully add a todo', async () => {
    const mockEvent = {
      body: JSON.stringify({
        id: '1',
        title: 'Sample Todo',
        completed: false,
        metadata: 'Some metadata'
      })
    };

    const mockPutCommandResponse = { id: '1', title: 'Sample Todo', completed: false, metadata: 'Some metadata' };
    PutCommand.mockResolvedValue(mockPutCommandResponse);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockPutCommandResponse);
    expect(PutCommand).toHaveBeenCalledWith({
      TableName: process.env.TODOS_TABLE,
      Item: {
        id: '1',
        title: 'Sample Todo',
        completed: false,
        metadata: 'Some metadata'
      }
    });
  });

  it('should handle validation error', async () => {
    const mockEvent = {
      body: JSON.stringify({
        // Missing 'id' field intentionally to trigger validation error
        title: 'Sample Todo',
        completed: false,
        metadata: 'Some metadata'
      })
    };

    const errorMessage = 'Validation error: "id" is required';
    const mockValidationError = new Error(errorMessage);
    mockValidationError.name = 'ValidationError';

    const expectedErrorResponse = {
      "message": JSON.stringify([
       {
         "code": "invalid_type",
         "expected": "string",
         "received": "undefined",
         "path": [
           "id"
         ],
         "message": "Required"
       }
     ], null, 2)
    };

    PutCommand.mockImplementation(() => {
      throw mockValidationError;
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual(expectedErrorResponse);
  });

});
