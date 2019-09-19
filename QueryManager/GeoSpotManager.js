'use strict';
const randomString = require('randomstring');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ddb = new AWS.DynamoDB();
const geoManager = require('dynamodb-geo');
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
  return geoTableManager.putPoint({
    RangeKeyValue: {S: randomString.generate(10)},
    GeoPoint: {
      latitude: spot.latitude,
      longitude: spot.longitude,
    },
    PutItemInput: {
      Item: {
        spotName: {S: spot.name},
        submittedBy: {S: spot.submittedBy},
      },
    },
  }).promise();
};


