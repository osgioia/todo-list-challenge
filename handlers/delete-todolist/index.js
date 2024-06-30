const DeleteCommand = require("../../lib/delete-command");
const TODOS_TABLE = process.env.TODOS_TABLE;

exports.handler = async (event) => {
  console.log("... Init ...");
  try {
    const queryString = event.queryStringParameters || event;
    const { id } = queryString;

    if (!id) {
      throw new Error("Either ID or Title must be provided.");
    }

    const key = { id };
    const params = {
      TableName: TODOS_TABLE,
      Key: key,
      ConditionExpression: "attribute_exists(id) and completed = :completed",
      ExpressionAttributeValues: {
        ":completed": true
      }
    };

    const deleteTodo = await DeleteCommand(params);

    return {
      statusCode: 200,
      body: JSON.stringify(deleteTodo)
    };
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Item not found" })
      };
    }
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    };
  }
};
