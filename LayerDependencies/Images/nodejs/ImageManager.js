'use strict';
const AWS = require('aws-sdk');
const s3Client = new AWS.S3();

module.exports.DankspotsImageUploadService = async (event) => {
  const fileName = '' + Math.random() + Date.now();
  const {url, fields} = await createPresignedUploadCredentials(fileName);
  return {
    statusCode: 201,
    body: JSON.stringify({
      formConfig: {
        uploadUrl: url,
        formFields: fields,
      },
    }),
    headers: {'Access-Control-Allow-Origin': '*'},
  };
};

const createPresignedUploadCredentials = (fileName) => {
  const params = {
    Bucket: process.env.IMAGE_BUCKET_NAME,
    Fields: {Key: fileName},
  };
  return new Promise((resolve, reject) =>
    s3Client.createPresignedPost(params, (error, result) =>
      error ? reject(error) : resolve(result)
    )
  );
};

