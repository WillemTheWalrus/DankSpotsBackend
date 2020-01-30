'use strict';
const tableNames = require('./TableNames');
const uuid = require('uuid/v1');
const geoManager = require('dynamodb-geo');
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
});
const ddb = new AWS.DynamoDB();
const config = new geoManager.GeoDataManagerConfiguration(ddb, tableNames.names.spots);
const geoTableManager = new geoManager.GeoDataManager(config);
const dynamoClient = new AWS.DynamoDB.DocumentClient();

module.exports.initializeDynamoClient = (newDynamo) => {
  dynamo = newDynamo;
};

/**
 * This method gets all public spots.
 * @return {JSON} Returns all public spots.
 */
module.exports.getAllPublicSpots = () => {
  console.log('table name: ' + tableNames.names.spots);
  const params = {
    TableName: tableNames.names.spots,
    ProjectionExpression: '#isPrivate, hashKey, rangeKey, spotName, geoJson, submittedBy, rating, spotType',
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

/**
 * Gets all spots that belong to a given user.
 * @param {String} username contains the username.
 * @return {JSON} returns all spots created by a user.
 */
module.exports.getUserSpots = (username) => {
  const params = {
    TableName: tableNames.names.spots,
    ProjectionExpression: 'isPrivate, hashKey, rangeKey, spotName, geoJson, #submittedBy, rating, spotType',
    FilterExpression: '#submittedBy = :submittedBy',
    ExpressionAttributeNames: {
      '#submittedBy': 'submittedBy',
    },
    ExpressionAttributeValues: {
      ':submittedBy': username,
    },
  };
  return dynamoClient.scan(params).promise();
};

/**
 * Gets all spots in a specified circle.
 * @param {Number} centerLongitude contains the longitude of the center of the circle.
 * @param {Number} centerLatitude conatins the latitude of the center of the circle.
 * @param {Number} radiusLengthInMeters contains the length of the radius of the circle in meters.
 * @return {JSON} Returns all of the spots in the specified circle.
 */
module.exports.getAllSpotsInCircle = (centerLongitude, centerLatitude, radiusLengthInMeters) => {
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

/**
 * Gets a spot by its ID.
 * @param {String} hashKey contains the hashKey of the spot.
 * @param {String} rangeKey contains the rangeKey of the spot.
 * @return {Promise} Returns a promise that can be called to fetch a spot by it's ID.
 */
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

/**
 * Saves a new spot.
 * @param {JSON} spot contains the spot to be saved.
 * @return {Promise} Returns a promise that can be used to save a spot.
 */
module.exports.saveSpot = (spot) => {
  return geoTableManager.putPoint({
    RangeKeyValue: {
      S: uuid(),
    },
    GeoPoint: {
      latitude: spot.geoJson.coordinates[1],
      longitude: spot.geoJson.coordinates[0],
    },
    PutItemInput: {
      Item: {
        spotName: {
          S: spot.spotName,
        },
        submittedBy: {
          S: spot.submittedBy,
        },
        isPrivate: {
          BOOL: spot.isPrivate,
        },
        rating: {
          N: '0',
        },
        spotType: {
          S: spot.spotType,
        },
        imageList: {
          SS: ['placeholder'],
        },
      },
    },
  }).promise();
};

/**
 * Update a spot with new data.
 * @param {JSON} spot contains the updated version of the spot to be saved.
 * @return {Promise} Returns a promise that can be used to update spots.
 */
module.exports.updateSpot = (spot) => {
  return geoTableManager.updatePoint({
    RangeKeyValue: {
      S: spot.rangeKey,
    },
    GeoPoint: {
      latitude: spot.latitude,
      longitude: spot.longitude,
    },
    UpdateItemInput: {// TableName and Key are filled in for you
      UpdateExpression: 'SET  isPrivate = :isPrivate ,' +
        'spotName = :spotName , ' +
        'submittedBy = :submittedBy ,' +
        'rating = :rating ,' +
        'spotType = :spotType',
      ExpressionAttributeValues: {
        ':isPrivate': {
          BOOL: spot.isPrivate,
        },
        ':spotName': {
          S: spot.spotName,
        },
        ':submittedBy': {
          S: spot.submittedBy,
        },
        ':rating': {
          N: spot.rating.toString(),
        },
        ':spotType': {
          S: spot.spotType,
        },
      },
    },
  }).promise();
};
