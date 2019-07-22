// Pulling in the aws software developer kit npm package.
const AWS = require('aws-sdk')

// Loading our environment variable from our .env file.
// Amazon docs specified that the access keys would be used automatically.
require('dotenv').config()

// Creating an S3 instance through the AWS SDK library.
const config = {
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: 'us-east-2'
}

const s3 = new AWS.S3()

s3.config.update(config)
// Wrapper function to return a promise from s3.upload
// This function receives the req.file that multer attaches to the request
// object.

const promiseS3Upload = function (fileObject) {

  return new Promise((resolve, reject) => {
    // Build the params from the req.file, the params are what the aws
    // documentation specified is necessary to send an upload.
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${Date.now()}${fileObject.originalname}`,
      Body: fileObject.buffer,
      ACL: 'public-read',
      ContentType: fileObject.mimetype
    }
    // Make the request to aws with the params object.
    s3.upload(params, (err, data) => {
      if (err) {
        // If the upload did not work we reject with the error.
        reject(err)
      } else {
        // If the upload was successful we resolve with the data.
        resolve(data)
      }
    })
  })
}

// Only exporting the function instead of an object.
module.exports = promiseS3Upload
