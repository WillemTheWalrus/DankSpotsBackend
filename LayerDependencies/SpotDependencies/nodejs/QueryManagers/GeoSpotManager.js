'use strict';
const tableNames = require('./TableNames');
const uuid = require('uuid/v1');
const geoManager = require('dynamodb-geo');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ddb = new AWS.DynamoDB();
const config = new geoManager.GeoDataManagerConfiguration(ddb, tableNames.names.spots);
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


module.exports.getAllSpotsInCircle = ( centerLongitude, centerLatitude, radiusLengthInMeters) => {
  if (!centerLongitude || !typeof centerLongitude === 'number') {
    console.log('incorrect longitude type');
    throw new TypeError('incorrect longitude type!');
  }
  if (!centerLatitude || !typeof centerLatitude === 'number') {
    console.log('incorrect latitude type');
    throw new TypeError('incorrect latitude type!');
  }
  if (!radiusLengthInMeters || !typeof radiusLengthInMeters === 'number') {
    console.log('incorrect radius type');
    throw new TypeError('incorrect radius type!');
  }

  return geoTableManager.queryRadius({
    RadiusInMeter: radiusLengthInMeters,
    CenterPoint: {
      latitude: centerLatitude,
      longitude: centerLongitude,
    },
  });
};


module.exports.getSpotById = (hashKey, rangeKey) => {
  // do i need to reference the entire path? tableNames.names.spots
  const params = {
    TableName: tableNames.names.spots,

    KeyConditionExpression: '#hashKey = :hashKey AND #rangeKey = :rangeKey',

    ExpressionAttributeNames: {
      '#hashKey': 'hashKey',
      '#rangeKey': 'rangeKey',
    },
    ExpressionAttributeValues: {
      ':hashKey': hashKey,
      ':rangeKey': rangeKey,
    },
  };
  return dynamoClient.query(params).promise();
};


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

module.exports.updateSpot = (spot) => {
  console.log('Rating: ' + spot.rating);
  return geoTableManager.updatePoint({
    RangeKeyValue: {S: spot.rangeKey},
    // what does the uuid do? I saw where it is defined but unsure (require('uuid/v1');)
    GeoPoint: {
      latitude: spot.latitude,
      longitude: spot.longitude,
    },
    UpdateItemInput: {// TableName and Key are filled in for you
      UpdateExpression: 'SET  isPrivate = :isPrivate ,' +
                              'spotName = :spotName , ' +
                              'submittedBy = :submittedBy ,'+
                              'rating = :rating',
      ExpressionAttributeValues: {
        ':isPrivate': {BOOL: spot.isPrivate},
        ':spotName': {S: spot.spotName},
        ':submittedBy': {S: spot.submittedBy},
        ':rating': {N: spot.rating.toString()},
      },
    },
  }).promise();
};
