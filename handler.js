const AWS = require('aws-sdk');

module.exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  var params = {
    ClientId: process.env['COGNITO_APP_CLIENT_ID'],
    Username: data.username, /* required */
    Password: data.password
  };

  let responseData;
  try {
    const createUser = await cognitoidentityserviceprovider.signUp(params).promise();
    responseData = {message: `Successfully created user ${createUser.UserSub}`, statusCode: 200};
  }
  catch (err) {
    // console.log(err.message); // an error occurred
    responseData = {message: err.message, statusCode: err.statusCode};
  }
  console.log(responseData);

  let response = {
    "statusCode": responseData.statusCode,
    "body": JSON.stringify({ 
      statusCode: responseData.statusCode, 
      message: responseData.message
    }),
    "headers": {
      "Access-Control-Allow-Origin": "*"
    }
  }
  callback(null, response);
};