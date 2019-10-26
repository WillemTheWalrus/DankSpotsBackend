'use strict';
const tableNames = require('./TableNames');
const uuid = require('uuid/v1');
const geoManager = require('dynamodb-geo');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ddb = new AWS.DynamoDB();
const config = new geoManager.GeoDataManagerConfiguration(ddb, 'SpotGeoTable');
const geoTableManager = new geoManager.GeoDataManager(config);
const dynamoClient = new AWS.DynamoDB.DocumentClient();

module.exports.initializeDynamoClient = (newDynamo) => {
  dynamo = newDynamo;
};

module.exports.getAllPublicSpots = () => {
  console.log('table name: ' + tableNames.names.spots);
  const params = {
    TableName: tableNames.names.spots,
    ProjectionExpression: '#isPrivate, hashKey, rangeKey, spotName, geoJson',
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


module.exports.getAllSpotsInCirle = ( centerLongitude, centerLatitude, radiusLengthInMeters) => {
  if (!centerLatitude || !typeof centerLatitude === 'number') throw TypeError;
  if ( !centerLongitude || !typeof centerLongitude === 'number') throw TypeError;
  if ( !radiusLengthInMeters || typeof radiusLengthInMeters === 'number') throw TypeError;

  return geoTableManager.queryRadius({
    RadiusInMeter: radiusLengthInMeters,
    CenterPoint: {
      latitude: centerLatitude,
      longitude: centerLongitude,
    },
  });
};

// cryptoRandomString({length: 10, type: 'url-safe'})
module.exports.getSpotById = (hashKey, rangeKey) => {
  //do i need to reference the entire path? tableNames.names.spots
  var params = {
    TableName: tableNames.names.spots,
    //this is referenced at the top of the page 
    //Is this command just taking you to the database? Based off of the TableNames file you created? 
    // Does it need to be capitalized? 
    ProjectionExpression: '#isPrivate, #hashKey, #rangeKey, spotName, geoHash',
    KeyConditionExpression: "#hashKey = :hashKey AND #rangeKey = :rangeKey", 

    ExpressionAttributeNames:{
        "#hashKey" : "hashKey",
        "#rangeKey" : "rangeKey"
    },
    ExpressionAttributeValues: {
        ":hashKey": hashKey,
        ":rangeKey": rangeKey
    }
  };
    return dynamoClient.query(params).promise();
};

//cryptoRandomString({length: 10, type: 'url-safe'})
module.exports.saveSpot = (spot) => {
  console.log('latitude: ' + spot.latitude);
  return geoTableManager.putPoint({
    RangeKeyValue: {S: uuid()},
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


