'use strict';
// eslint-disable-next-line max-len
const tableNames = require('/opt/nodejs/QueryManagers/TableNames');
const cryptoRandomString = require('crypto-random-string');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ddb = new AWS.DynamoDB();
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const geoManager = require('dynamodb-geo');
const config = new geoManager.GeoDataManagerConfiguration(ddb, 'SpotGeoTable');
const geoTableManager = new geoManager.GeoDataManager(config);

module.exports.initializeDynamoClient = (newDynamo) => {
  dynamo = newDynamo;
};

module.exports.getAllPublicSpots = () => {
  console.log('table name: ' + tableNames.names.spots);
  const params = {
    TableName: tableNames.names.spots,
    ProjectionExpression: '#isPrivate, hashKey, rangeKey, spotName, geoHash',
    FilterExpression: '#isPrivate = :isPrivate',
    ExpressionAttributeNames: {
      '#isPrivate': 'isPrivate',
    },
    ExpressionAttributeValues: {
      ':isPrivate': false,
    },
  };

  return dynamoClient.scan(params).promise();
};

module.exports.getSpotById = (hashKey, rangeKey) => {

};
//cryptoRandomString({length: 10, type: 'url-safe'})
module.exports.saveSpot = (spot) => {
  console.log('latitude: ' + spot.latitude);
  return geoTableManager.putPoint({
    RangeKeyValue: {S:'3333'},
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


