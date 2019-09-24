'use strict';
const geoSpotManager = require('../QueryManagers/GeoSpotManager');
const tableNames = require('../QueryManagers/TableNames');

exports.getAllPublicSpotsFunction = (event, context, callback) => {
  geoSpotManager.getAllSpots(tableNames.names.spots)
      .then((response) =>{
        console.log(response);
        sendResponse(200, response, callback);
      });
};

exports.savePublicSpotfunction = (event, context, callback) => {
  geoSpotManager.saveSpot(event.body.spot)
      .then((response) => {
        console.log(event.body.spot.name);
        sendResponse(200, response, callback);
      });
};

/**
 * Sends a response with the given content and status code
 * @param {*} statusCode
 * @param {*} message
 * @param {*} callback
 */
function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
  callback(null, response);
}
