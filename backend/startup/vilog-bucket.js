const AWS = require("aws-sdk");
const BUCKET_NAME = 'vilog-bucket'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    // Set your region here
    LocationConstraint: "eu-west-1",
  },
};

s3.createBucket(params, function (err, data) {
  if (err) console.log(err, err.stack);
  else console.log("Bucket Created Successfully", data.Location);
});