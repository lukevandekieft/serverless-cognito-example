const AWS = require('aws-sdk');

module.exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  if (data.function === "signUp") {
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

    const response = {
      "statusCode": responseData.statusCode,
      "body": JSON.stringify(responseData),
      "headers": {
        "Access-Control-Allow-Origin": "*"
      }
    }
    callback(null, response);

  } else if (data.function === "logIn") {
    var params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env['COGNITO_APP_CLIENT_ID'],
      AuthParameters: {
        USERNAME: data.username,
        PASSWORD: data.password
      }
    };

    let responseData;
    try {
      const logIn = await cognitoidentityserviceprovider.initiateAuth(params).promise();
      console.log(logIn);
      responseData = {message: `Logged in user ${data.username}`, IdToken: logIn.AuthenticationResult.IdToken, statusCode: 200};
    }
    catch (err) {
      // console.log(err.message); // an error occurred
      responseData = {message: err.message, statusCode: err.statusCode};
    }
    console.log(responseData);

    const response = {
      "statusCode": responseData.statusCode,
      "body": JSON.stringify(responseData),
      "headers": {
        "Access-Control-Allow-Origin": "*"
      }
    }
    callback(null, response);

  } else {
    const response = {
      "statusCode": 404,
      "body": JSON.stringify({ 
        statusCode: 404, 
        message: "Error: no auth function selected"
      }),
      "headers": {
        "Access-Control-Allow-Origin": "*"
      }
    }
    callback(null, response);
  }
};