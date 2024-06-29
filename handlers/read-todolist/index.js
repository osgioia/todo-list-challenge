const GetCommand = require("../../lib/get-command");
const TODOS_TABLE = process.env.TODOS_TABLE;

exports.handler = async (event) => {
  console.log("... Init ...");
  try {
    const queryString = event.queryStringParameters || event;
    const { id, title } = queryString;

    if (!id && !title) {
      throw new Error("Either ID or Title must be provided.");
    }

    if (id && title) {
      throw new Error("ID and Title cannot be provided at the same time.");
    }

    const key = id ? { id } : { title };
    const params = {
      TableName: TODOS_TABLE,
      Key: key
    };

    const getTodos = await GetCommand(params);

    return {
      statusCode: 200,
      body: JSON.stringify(getTodos)
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    };
  }
};
