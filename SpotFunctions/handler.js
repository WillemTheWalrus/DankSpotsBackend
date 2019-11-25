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
      .then((response) => {
        console.log(response);
        sendResponse(200, response, callback);
      }).catch((error) => {
        console.log('error while executing query');
        sendResponse(500, 'Error while fethcing public spots from table: ' + error, callback);
      });
};

/**
 * Gets all spots in a specifified circular region.
 * @param {json} event contains path, headers, http method, and body.
 * @param {json} context  contains environment data.
 * @param {function} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.getAllSpotsInCircle = (event, context, callback) => {
  let radiusInMeters = event.queryStringParameters.radius;
  let latitude = event.queryStringParameters.latitude;
  let longitude = event.queryStringParameters.longitude;

  if (!radiusInMeters) sendResponse(400, 'radius cannot be null!', callback);
  if (!latitude) sendResponse(400, 'The latitude cannot be null!', callback);
  if (!longitude) sendResponse(400, 'The longitude cannot be null!', callback);

  radiusInMeters = parseInt(event.queryStringParameters.radius);
  latitude = parseFloat(event.queryStringParameters.latitude);
  longitude = parseFloat(event.queryStringParameters.longitude);

  geoSpotManager.getAllSpotsInCircle(longitude, latitude, radiusInMeters).then((response) => {
    console.log('response: ' + response);
    sendResponse(200, response, callback);
  }).catch((error) => {
    console.log('error while executing radial query: ' + error);
    sendResponse(500, 'Error executing radial query', callback);
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
        sendResponse(200, response, callback);
      });
};

/**
 * Updates a spot with the provided spot data.
 * @param {json} event contains path, headers, http method, and body.
 * @param {json} context  contains environment data.
 * @param {function} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
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

/**
 * Gets a spot and all of its fields by its ID (hashKey + rangeKey).
 * @param {json} event constains path, headers, http method, and body.
 * @param {json} context  contains environment data.
 * @param {function} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.getSpotById = (event, context, callback) => {
  // Right the body comes in as text instead of JSON.
  // Need to investigate why this happening despite
  // the incluse of the application/JSON header.
  const hashKey = parseFloat(event.pathParameters.hashKey);
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
    statusCode,
    body: JSON.stringify(message),
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:8100',
      'Access-Control-Allow-Credentials': true,
    },
  };
  callback(null, response);
}
