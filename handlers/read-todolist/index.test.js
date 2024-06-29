const { handler } = require('./index');
const GetCommand = require('../../lib/get-command');

jest.mock('../../lib/get-command', () => jest.fn());

describe('handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get a todo by ID', async () => {
    const mockEvent = {
      queryStringParameters: {
        id: '1'
      }
    };

    const mockGetCommandResponse = { id: '1', title: 'Sample Todo', completed: false, metadata: 'Some metadata' };
    GetCommand.mockResolvedValue(mockGetCommandResponse);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockGetCommandResponse);
    expect(GetCommand).toHaveBeenCalledWith({
      TableName: process.env.TODOS_TABLE,
      Key: { id: '1' }
    });
  });

  it('should successfully get a todo by Title', async () => {
    const mockEvent = {
      queryStringParameters: {
        title: 'Sample Todo'
      }
    };

    const mockGetCommandResponse = { id: '1', title: 'Sample Todo', completed: false, metadata: 'Some metadata' };
    GetCommand.mockResolvedValue(mockGetCommandResponse);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockGetCommandResponse);
    expect(GetCommand).toHaveBeenCalledWith({
      TableName: process.env.TODOS_TABLE,
      Key: { title: 'Sample Todo' }
    });
  });

  it('should handle missing id and title in query parameters', async () => {
    const mockEvent = {
      queryStringParameters: {}
    };

    const errorMessage = 'Either ID or Title must be provided.';
    const expectedErrorResponse = {
      statusCode: 400,
      body: JSON.stringify({ message: errorMessage })
    };

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual(expectedErrorResponse);
    expect(GetCommand).not.toHaveBeenCalled();
  });

  it('should handle both id and title provided in query parameters', async () => {
    const mockEvent = {
      queryStringParameters: {
        id: '1',
        title: 'Sample Todo'
      }
    };

    const errorMessage = 'ID and Title cannot be provided at the same time.';
    const expectedErrorResponse = {
      statusCode: 400,
      body: JSON.stringify({ message: errorMessage })
    };

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual(expectedErrorResponse);
    expect(GetCommand).not.toHaveBeenCalled();
  });

  // Add more test cases as needed
});
