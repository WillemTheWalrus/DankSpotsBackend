/**
 * This class is a script to setup the Spot geo table. Run 'node SetupGeoSpotTable.js'
 */
'use strict';
const AWS = require('../QueryManager/node_modules/aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ddb = new AWS.DynamoDB();

const geoManager = require('../QueryManager/node_modules/dynamodb-geo');

const config = new geoManager.GeoDataManagerConfiguration(ddb, 'SpotGeoTable');
const geoTableManager = new geoManager.GeoDataManager(config);
const createTableInput = geoManager.GeoTableUtil.getCreateTableRequest(config);

ddb.createTable(createTableInput).promise()
    .then(() => {
      return ddb.waitFor('tableExists', {TableName: config.tableName}).promise();
    })
    .then(function() {
      console.log('Table created and ready!');
    });
