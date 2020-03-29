
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
const processResponse = require('./process-response.js');
const TABLE_NAME = process.env.EVENT_TABLE,
  PRIMARY_KEY = process.env.PRIMARY_KEY,
  IS_CORS = true;

const GetRollade1 = Rollade1ScanInput();

module.exports.upload = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }
  if (!event.body) {
    return processResponse(IS_CORS, 'invalid', 400);
  }
  const item = JSON.parse(event.body);
  item[PRIMARY_KEY] = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: item
  }
  try {
    await dynamoDb.put(params).promise()
    return processResponse(IS_CORS);
  } catch (error) {
    let errorResponse = `Error: Execution update, caused a Dynamodb error, please look at your logs.`;
    if (error.code === 'ValidationException') {
      if (error.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(error);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};


module.exports.events = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }
  const event_name = event.pathParameters.event_name;
  let params = {
    TableName: TABLE_NAME,
    FilterExpression: "#01 = :02",
    ExpressionAttributeNames: {
      "#01": "event"
    },
    ExpressionAttributeValues: {
      ":02": event_name
    }
  }
  try {
    const response = await dynamoDb.scan(params).promise();
    return processResponse(true, response.Items);
  } catch (dbError) {
    let errorResponse = `Error: Execution update, caused a Dynamodb error, please look at your logs.`;
    if (dbError.code === 'ValidationException') {
      if (dbError.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(dbError);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};


function Rollade1ScanInput() {
  return {
    "TableName": "particle-backend-events-dev",
    "ConsistentRead": false,
    "FilterExpression": "#50060 = :50060",
    "ExpressionAttributeValues": {
      ":50060": {
        "S": "Rollade_1"
      }
    },
    "ExpressionAttributeNames": {
      "#50060": "event"
    }
  }
}