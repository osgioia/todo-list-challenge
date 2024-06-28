const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");


module.exports = async(params) => {
    try {
        const dynamoDBClient = new DynamoDBClient({});
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);        
        
        const command = new GetCommand(params);

        const response = await docClient.send(command);

        return response;
    } catch (error) {
        console.error(error)

        throw error
    }
}


