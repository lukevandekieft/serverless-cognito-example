const AWS = require('aws-sdk');

module.exports.handler = async (event, context, callback) => {
  const response = {
    "statusCode": 200,
    "body": JSON.stringify({ 
      statusCode: 200, 
      message: "You've reached secure content!"
    }),
    "headers": {
      "Access-Control-Allow-Origin": "*"
    }
  }
  callback(null, response);
};