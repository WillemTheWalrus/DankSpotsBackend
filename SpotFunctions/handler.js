'use strict';
const geoSpotManager = require('/opt/nodejs/QueryManagers/GeoSpotManager');
const spotValidator = require('/opt/nodejs/spotValidator');
const tableNames = require('/opt/nodejs/QueryManagers/TableNames');
const ImageManager = require('/opt/nodejs/ImageManager');


/**
 * Gets all public spots and sends them back in the callback function.
 * @param {JSON} event contains path, headers, http method, and body.
 * @param {JSON} context  contains environment data.
 * @param {CallableFunction} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.getAllPublicSpots = (event, context, callback) => {
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
 * @param {JSON} event contains path, headers, http method, and body.
 * @param {JSON} context  contains environment data.
 * @param {CallableFunction} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.getAllSpotsInCircle = (event, context, callback) => {
  let radiusInMeters = event.queryStringParameters.radius;
  let latitude = event.queryStringParameters.latitude;
  let longitude = event.queryStringParameters.longitude;

  if (!radiusInMeters) sendResponse(400, 'radius cannot be null!', callback);
  else if (!latitude) sendResponse(400, 'The latitude cannot be null!', callback);
  else if (!longitude) sendResponse(400, 'The longitude cannot be null!', callback);
  else {
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
  }
};

/**
 * Saves a public spot.
 * @param {JSON} event contains path, headers, http method, and body.
 * @param {JSON} context  contains environment data.
 * @param {CallableFunction} callback  contains the callback method to be
 *  called when the function has finished executing.
 */
exports.savePublicSpot = (event, context, callback) => {
  // Right the body comes in as text instead of JSON.
  // Need to investigate why this happening despite
  // the incluse of the application/JSON header.
  const spotJSON = JSON.parse(event.body);
  if (!spotValidator.validateSpot(spotJSON)) {
    sendResponse(400, 'Incorrectly formated spot', callback);
  } else {
    geoSpotManager.saveSpot(spotJSON.spot)
        .then((response) => {
          sendResponse(200, response, callback);
        });
  }
};

// TODO: add in delete functionality
exports.deleteSpot = (event, context, callback) => {
  console.log('in delete spot function');
};
/**
 * Updates a spot with the provided spot data.
 * @param {JSON} event contains path, headers, http method, and body.
 * @param {JSON} context  contains environment data.
 * @param {CallableFunction} callback  contains the callback method to be
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
 * @param {JSON} event constains path, headers, http method, and body.
 * @param {JSON} context  contains environment data.
 * @param {CallableFunction} callback  contains the callback method to be
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


exports.GetImageUploadURL = (event, context, callback) => {
  // Right the body comes in as text instead of JSON.
  // Need to investigate why this happening despite
  // the incluse of the application/JSON header.
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  ImageManager.DankspotsImageUploadService(context)
      .then((response) => {
        console.log('Image Uploaded');
        sendResponse(200, response, callback);
      });
};

/**
 * Sends a response with the given content and status code
 * @param {Number} statusCode contians the HTTP status code to be returned in the response.
 * @param {String} message contians a message to be sent
 *  back with the response.
 * @param {CallableFunction} callback contains the callback method that is
 *  called to return the response to the client.
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
