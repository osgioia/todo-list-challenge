const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const isLocal = process.env.STAGE === "local";

module.exports = async(params) => {
    try {
        const dynamoDBClient = new DynamoDBClient(
            isLocal
              ? {
                  region: 'localhost',
                  endpoint: 'http://0.0.0.0:8081',
                  credentials: {
                    accessKeyId: 'MockAccessKeyId',
                    secretAccessKey: 'MockSecretAccessKey'
                  }
                }
              : {}
          );
          
          const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
            marshallOptions: {
                removeUndefinedValues: true
            }
        });        
        
        const command = new UpdateCommand(params);

        const response = await docClient.send(command);

        return response;
    } catch (error) {
        console.error(error)

        throw error
    }
}
