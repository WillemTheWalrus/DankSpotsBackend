/**
 * This class is a script to setup the Spot geo table. Run 'node SetupGeoSpotTable.js'
 */
'use strict';
const geoManager = require('dynamodb-geo');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const ddb = new AWS.DynamoDB();
const config = new geoManager.GeoDataManagerConfiguration(ddb, 'SpotGeoTable');
config.hashKeyLength = 6;
const createTableInput = geoManager.GeoTableUtil.getCreateTableRequest(config);

ddb.createTable(createTableInput).promise()
    .then(() => {
      return ddb.waitFor('tableExists', {TableName: config.tableName}).promise();
    })
    .then(function() {
      console.log('Table created and ready!');
    });
