'use strict';
const AWS = require('./node_modules/aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ddb = new AWS.DynamoDB();

const geoManager = require('./node_modules/dynamodb-geo');

const config = new geoManager.GeoDataManagerConfiguration(ddb, 'SpotGeoTable');
const geoTableManager = new geoManager.GeoDataManager(config);



module.exports.initializeDynamoClient = (newDynamo) => {
  dynamo = newDynamo;
};

module.exports.getAllItemsFromTable = (tableName) => {
  const params = {
    TableName: tableName,
  };

  return dynamo.scan(params).promise();
};

module.exports.getSpotById = (spotId) => {
   
};

module.exports.saveSpot = (spot) => {
   
};


