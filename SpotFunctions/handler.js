'use strict';
const geoSpotManager = require('/opt/nodejs/QueryManagers/GeoSpotManager');
const spotValidator = require('/opt/nodejs/spotValidator');


/**
 * Gets all public spots and sends them back in the callback function.
 * @param {json} event contains path, headers, http method, and body.
 * @param {json} context  contains environment data.
 * @param {function} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.getAllPublicSpotsFunction = (event, context, callback) => {
  geoSpotManager.getAllPublicSpots()
      .then((response) =>{
        console.log(response);
        sendResponse(200, response, callback);
      });
};

exports.getAllSpotsInCircle = (event, context, callback) => {
  const radiusInMeters = parseInt(event.queryStringParameters.radius);
  const latitude = parseFloat(event.queryStringParameters.latitude);
  const longitude = parseFloat(event.queryStringParameters.longitude);

  geoSpotManager.getAllSpotsInCircle(longitude, latitude, radiusInMeters).then((response) => {
    console.log('response: ' + response);
    sendResponse(200, response, callback);
  }).catch((error) => {
    console.log('error while executing radial query: ' + error);
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

exports.updateSpot = (event, context, callback) => {
  // Right the body comes in as text instead of JSON.
  // Need to investigate why this happening despite
  // the incluse of the application/JSON header.
  const spotJSON = JSON.parse(event.body);
  if (!spotValidator.validateSpot(spotJSON)) {
    sendResponse(400, 'Incorrectly formated spot', callback);
  } else {
    geoSpotManager.updateSpot(spotJSON.spot)
        .then((response) => {
          console.log('It works!');
          sendResponse(200, response, callback);
        });
  }
};

exports.getSpotById= (event, context, callback) => {
  // Right the body comes in as text instead of JSON.
  // Need to investigate why this happening despite
  // the incluse of the application/JSON header.
  const hashKey = event.pathParameters.hashKey;
  const rangeKey = event.pathParameters.rangeKey;
  geoSpotManager.getSpotById(hashKey, rangeKey)
      .then((response) => {
        // console.log('Loading Location: ' + event.pathParameters.);
        // Only can pass in built path parameters that are within template.yaml
        console.log(response);
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
