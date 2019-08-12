/**
 * This class is a script to setup the Spot geo table. Run 'node SetupGeoSpotTable.js'
 */
'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});
const ddb = new AWS.DynamoDB();

const geoManager = require('dynamodb-geo');

const config = new geoManager.GeoDataManagerConfiguration(ddb, 'SpotGeoTable');
const geoTableManager = new geoManager.GeoDataManager(config);
const createTableInput = geoManager.GeoTableUtil.getCreateTableRequest(config);

ddb.createTable(createTableInput).promise()
    .then(function()
    {return ddb.waitFor('tableExists', {TableName: config.tableName}).promise();
})
    .then(function() {
console.log('Table created and ready!');
});
