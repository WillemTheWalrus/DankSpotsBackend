const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
});
const s3 = new AWS.S3();

s3.putObject({
  Bucket: 'dankimagebucket',
  Body: 'hello',
  Key: 'spot//image',
}).promise().then( (response) => {
  console.log(response);
});
