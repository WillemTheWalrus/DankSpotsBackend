'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.initializeDynamoClient = (newDynamo) => {
  dynamo = newDynamo;
};

module.exports.getAllItemsFromTable = (tableName) => {
  const params = {
    TableName: tableName,
  };

  return dynamo.scan(params).promise();
};
