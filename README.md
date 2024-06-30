# Todo List API

This is a RESTful API for managing a todo list, created using the Serverless Framework and deployed on AWS Lambda.

## Project Description

The API allows CRUD (Create, Read, Update, Delete) operations on a DynamoDB table called `Todos`. Deletion of tasks is only allowed if the task is completed.

## Prerequisites

- Node.js (v14 or higher)
- Serverless Framework (`npm install -g serverless`)
- AWS CLI configured with access credentials

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/todo-list-api.git
   cd todo-list-api
   ```
2. Install the project dependencies:
    
    ```bash
    npm install
    ```
3. Install the local env for DynamoDB (Java is required):
    
    ```bash
    npm install serverless-dynamodb    
    ```

4. Install DynamoDB Admin (for see the data):
    
    ```bash
    npm install -g dynamodb-admin

    # For Windows:
    set DYNAMO_ENDPOINT=http://localhost:8081
    dynamodb-admin

    # For Mac/Linux:
    DYNAMO_ENDPOINT=http://localhost:8081 dynamodb-admin
    ```

## Deployment

To deploy the API on AWS, run the following command:

```bash
npm run deploy
```

This command will deploy the resources on AWS and provide you with the API endpoints.

## Running Locally

You can run the API locally using serverless-offline:

```bash
npm run offline:local
``` 

The API will be available at http://localhost:4000.

## Using the API
### Get Todo List

Endpoint: GET /todo-list

Description: Get an task in the todo list.

Example:

```bash
    curl http://localhost:4000/todo-list?id=1aaa
```

### Create a New Task

Endpoint: POST /todo-list

Description: Creates a new task in the todo list.

Request Body:

```json
    {
    "id": "1",
    "title": "New task",
    "completed": false,
    "metadata": "data"
    }
```

Example:

```bash
    curl -X POST http://localhost:4000/todo-list -d '{"id": "1aaa", "title": "New task", "completed": false, "metadata":"data"}' -H 'Content-Type: application/json'
```

### Update a Task

Endpoint: PUT /todo-list/

Description: Updates an existing task in the todo list.

Request Body:

```json
    {
    "id": "1aaa",
    "paramsName": "completed",
    "paramsValue": true
    }
```

Example:

```bash
    curl -X PUT http://localhost:4000/todo-list/ -d '{"id": "1aaa","paramsName": "completed","paramsValue": true}' -H 'Content-Type: application/json'
```

### Delete a Task

Endpoint: DELETE /todo-list/{id}

Description: Deletes a task from the todo list. It can only be deleted if the task is completed.

Example:

```bash
    curl -X DELETE http://localhost:4000/todo-list/?id=1aaa
```

## Testing

To run the unit tests, use the following command:

```bash
    npm run test
```

## API Documentation

The OpenAPI specification for this API is available in the openapi.yaml file. You can view and test the API using Swagger UI.
Accessing Swagger UI

- Clone this repository.
- Open the openapi.yaml file with Swagger UI.

You can also use tools like Redoc to generate static documentation from the OpenAPI specification.
Example

```bash
    npm install -g redoc-cli
    redoc-cli bundle openapi.yaml
    open redoc-static.html
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
