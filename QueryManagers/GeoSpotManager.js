'use strict';
const tableNames = require('./TableNames');
const cryptoRandomString = require('crypto-random-string');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ddb = new AWS.DynamoDB();
const geoManager = require('dynamodb-geo');
const config = new geoManager.GeoDataManagerConfiguration(ddb, 'SpotGeoTable');
const geoTableManager = new geoManager.GeoDataManager(config);

module.exports.initializeDynamoClient = (newDynamo) => {
  dynamo = newDynamo;
};

module.exports.getAllPublicSpots = () => {
  const params = {
    TableName: tableNames.spots,
    KeyConditionExpression: '#isPrivate = :isPrivate',
    ExpressionAttributeNames: {
      '#isPrivate': 'isPrivate',
    },
    ExpressionAttributeValues: {
      ':isPrivate': false,
    },
  };

  return dynamo.query(params).promise();
};

module.exports.getSpotById = (hashKey, rangeKey) => {

};

module.exports.saveSpot = (spot) => {
  return geoTableManager.putPoint({
    RangeKeyValue: {S: cryptoRandomString({length: 10, type: 'url-safe'})},
    GeoPoint: {
      latitude: spot.latitude,
      longitude: spot.longitude,
    },
    PutItemInput: {
      Item: {
        spotName: {S: spot.name},
        submittedBy: {S: spot.submittedBy},
        isPrivate: {BOOL: spot.isPrivate},
      },
    },
  }).promise();
};


