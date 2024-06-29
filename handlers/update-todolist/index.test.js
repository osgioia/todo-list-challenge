const { handler } = require('./index');
const updateCommand = require('../../lib/update-command');

jest.mock('../../lib/update-command', () => jest.fn());

describe('handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update todo', async () => {
    const mockEvent = {
      body: JSON.stringify({
        id: '1',
        paramsName: 'completed',
        paramsValue: true
      })
    };

    const mockUpdateCommandResponse = { id: '1', paramsName: 'completed', paramsValue: true };
    updateCommand.mockResolvedValue(mockUpdateCommandResponse);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockUpdateCommandResponse);
    expect(updateCommand).toHaveBeenCalledWith({
      TableName: process.env.TODOS_TABLE,
      Key: { id: '1' },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'set completed = :v',
      ExpressionAttributeValues: { ':v': true },
      ReturnValues: 'ALL_NEW'
    });
  });

  it('should handle string paramsValue correctly', async () => {
    const mockEvent = {
      body: JSON.stringify({
        id: '1',
        paramsName: 'paramsName',
        paramsValue: 'some value'
      })
    };

    const mockUpdateCommandResponse = { id: '1', paramsName: 'paramsName', paramsValue: 'some value' };
    updateCommand.mockResolvedValue(mockUpdateCommandResponse);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockUpdateCommandResponse);
    expect(updateCommand).toHaveBeenCalledWith({
      TableName: process.env.TODOS_TABLE,
      Key: { id: '1' },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'set paramsName = :v',
      ExpressionAttributeValues: { ':v': 'some value' },
      ReturnValues: 'ALL_NEW'
    });
  });

  it('should handle boolean paramsValue correctly', async () => {
    const mockEvent = {
      body: JSON.stringify({
        id: '1',
        paramsName: 'completed',
        paramsValue: 'false' // can be 'true' or 'false'
      })
    };

    const mockUpdateCommandResponse = { id: '1', paramsName: 'completed', paramsValue: false };
    updateCommand.mockResolvedValue(mockUpdateCommandResponse);

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockUpdateCommandResponse);
    expect(updateCommand).toHaveBeenCalledWith({
      TableName: process.env.TODOS_TABLE,
      Key: { id: '1' },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'set completed = :v',
      ExpressionAttributeValues: { ':v': false },
      ReturnValues: 'ALL_NEW'
    });
  });

  it('should handle item not found error', async () => {
    const mockEvent = {
      body: JSON.stringify({
        id: '1',
        paramsName: 'completed',
        paramsValue: true
      })
    };

    const mockNotFoundError = new Error('ConditionalCheckFailedException');
    mockNotFoundError.name = 'ConditionalCheckFailedException';

    updateCommand.mockImplementation(() => {
      throw mockNotFoundError;
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ message: 'Item not found' });
  });

  // Add more test cases as needed
});
