'use strict';

var AWS = require("aws-sdk")

var lambda = new AWS.Lambda({
  region: 'eu-west-1'
});

module.exports = FunctionName => payload => {
  return lambda.invoke({
      FunctionName,
      Payload: JSON.stringify(payload),
    }).promise()
    .then(res => {
      // this only check that the lambda invocation was successfull.
      // errors within the function will have a FunctionError header, but we check the body instead (next .then)
      if (res.StatusCode == 200 || res.StatusCode == 201) {
        return JSON.parse(res.Payload)
      } else {
        throw new Error(res)
      }
    })
    .then(res => {
      //we need to check for function errors here, since lambda INVOKE will return 200
      if (res && res.errorMessage) {
        console.error({ FunctionName, payload }, res)
        throw new Error(res.errorMessage)
      }

      return res
    })
}
