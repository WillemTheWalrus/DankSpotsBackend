'use strict';
const AWS = require('aws-sdk');
const s3Client = new AWS.S3();
const moment = require('moment');
const sha1 = require('sha1');

module.exports.dankspotsImageUploadService = async (body) => {

  const base64String = body.base64String;
  let imageMetaData = base64String.split(",");
  const buffer = Buffer.from(base64String, 'base64');

  const params = getFileRequestParameters(buffer);
  s3Client.putObject(params, (err, data) => {
    if (err) {
      console.log('Error!!! ' + err);
    }
  });
};

// module.exports.addImageToSpot = (imageName, hashKey, rangeKey) => {
//   geoSpotManager.getSpotById(hashKey, rangeKey).then((response) => {
//     console.log(response);
//     if (response == null) {
//       console.log('no spot was found');
//     } else {
//       geoSpotManager.updateSpot();
//     }
//   });
// };

const getFileRequestParameters = (buffer, fileExtension) => {
  const hash = sha1(new Buffer(new Date().toString()));
  const now = moment().format('YYY-MM-DD_HH:mm:ss');

  const filePath = hash + '/';
  const fileName = now + '.jpg';
  const fileFullName = filePath + fileName;
  const fileFullPath = process.env.IMAGE_BUCKET_NAME + '/' + filePath;

  console.log(fileFullPath);

  const params = {
    Bucket: process.env.IMAGE_BUCKET_NAME,
    Key: fileFullName,
    Body: buffer,
  };

  console.log(params);
  return params;
};

