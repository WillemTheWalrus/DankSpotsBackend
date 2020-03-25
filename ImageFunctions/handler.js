
const ImageManager = require('/opt/nodejs/ImageManager');

exports.uploadImage = (event, context, callback) => {
  ImageManager.dankspotsImageUploadService(JSON.parse(event.body))
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
};

