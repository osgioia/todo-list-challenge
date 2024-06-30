const { z } = require("zod");
const updateCommand = require("../../lib/update-command");
const TODOS_TABLE = process.env.TODOS_TABLE;

const todoSchema = z.object({
  id: z.string(),
  paramsName: z.string(),
  paramsValue: z.union([z.string(), z.boolean()])
});

exports.handler = async (event) => {
  console.log("... Init ...");
  try {
    const body = JSON.parse(event.body);

    const { id, paramsName, paramsValue } = todoSchema.parse(body);

    let attributeValue;
    if (paramsName === "completed") {
      attributeValue = paramsValue === true || paramsValue === "true";
    } else {
      attributeValue = `${paramsValue}`;
    }

    const params = {
      TableName: TODOS_TABLE,
      Key: {
        id: id
      },
      ConditionExpression: "attribute_exists(id)",
      UpdateExpression: `set ${paramsName} = :v`,
      ExpressionAttributeValues: {
        ":v": attributeValue
      },
      ReturnValues: "ALL_NEW"
    };

    console.log(params);

    const updateTodo = await updateCommand(params);

    return {
      statusCode: 200,
      body: JSON.stringify(updateTodo)
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
