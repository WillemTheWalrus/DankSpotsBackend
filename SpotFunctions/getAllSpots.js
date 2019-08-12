'use strict';

const databaseManager = require('./DatabaseManager');
const tableNames = require('./TableNames');

exports.getAllSpotsFunction = (event, context, callback) => {
  databaseManager.getAllItemsFromTable(tableNames.names.spots)
      .then((response) =>{
        console.log(response);
        sendResponse(200, response, callback);
      } );
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
