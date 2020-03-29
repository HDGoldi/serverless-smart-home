
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
const processResponse = require('./process-response.js');
const TABLE_NAME = process.env.EVENT_TABLE,
  PRIMARY_KEY = process.env.PRIMARY_KEY,
  IS_CORS = true;

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
    response.Items.sort(sortByProperty("published_at"))
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


function sortByProperty(property) {
  return function (a, b) {
    if (a[property] < b[property])
      return 1;
    else if (a[property] > b[property])
      return -1;

    return 0;
  }
}