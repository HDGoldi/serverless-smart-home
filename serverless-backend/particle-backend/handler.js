'use strict';

const uuid = require("uuid/v4");
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.webook = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const name = requestBody.name;
  const data = requestBody.data;

  if (typeof name !== 'string' || typeof data !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    return;
  }

  submitEvent(events(name, data))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully stored event`,
          candidateId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to store event`
        })
      })
    });

};

const submitEvent = event => {
  console.log('Submitting event');
  const events = {
    TableName: process.env.EVENT_TABLE,
    Item: event,
  };
  return dynamoDb.put(events).promise()
    .then(res => event);
};

const events = (name, data) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    name: name,
    data: data,
    receivedAt: timestamp,
  };
};
