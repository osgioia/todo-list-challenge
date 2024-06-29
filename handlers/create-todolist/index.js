const { z } = require("zod");
const PutCommand = require("../../lib/put-command");
const TODOS_TABLE = process.env.TODOS_TABLE;

const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  metadata: z.string()
});

exports.handler = async (event) => {
  console.log("... Init ...");
  try {
    const body = JSON.parse(event.body);

    const { id, title, completed, metadata } = todoSchema.parse(body);

    const params = {
      TableName: TODOS_TABLE,
      Item: {
        id: id,
        title: title,
        completed: completed,
        metadata: metadata
      }
    };

    const putTodo = await PutCommand(params);

    return {
      statusCode: 200,
      body: JSON.stringify(putTodo)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    };
  }
};
