'use strict';
const geoSpotManager = require('/opt/nodejs/QueryManagers/GeoSpotManager');
const tableNames = require('/opt/nodejs/QueryManagers/TableNames');


/**
 * Gets all public spots and sends them back in the callback function.
 * @param {json} event contains path, headers, http method, and body.
 * @param {json} context  contains environment data.
 * @param {function} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.getAllPublicSpotsFunction = (event, context, callback) => {
  geoSpotManager.getAllPublicSpots(tableNames.names.spots)
      .then((response) =>{
        console.log(response);
        sendResponse(200, response, callback);
      });
};

/**
 * Saves a public spot.
 * @param {json} event contains path, headers, http method, and body.
 * @param {json} context  contains environment data.
 * @param {function} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.savePublicSpot = (event, context, callback) => {
  // Right the body comes in as text instead of JSON.
  // Need to investigate why this happening despite
  // the incluse of the application/JSON header.
  const spotJSON = JSON.parse(event.body);
  geoSpotManager.saveSpot(spotJSON.spot)
      .then((response) => {
        console.log('chillen');
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
