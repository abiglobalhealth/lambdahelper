var AWS = require("aws-sdk")
var lambda = new AWS.Lambda({
  region: 'eu-west-1'
});

module.exports = res => {
  return _checkStatusCode(res)
    .then(_extractPayload)
    .then(_checkPayload)
}

// this only checks that the lambda invocation was successfull.
// errors within the function will have a FunctionError header, but we check the body instead (next .then)
function _checkStatusCode(res) {
  return new Promise((resolve, reject) => {
    if (res.StatusCode == 200 || res.StatusCode == 201) {
      resolve(res)
    } else {
      reject(res)
    }
  })
}

function _extractPayload(res) {
  return JSON.parse(res.Payload)
}

//we need to check for function errors here, since lambda INVOKE will return 200
function _checkPayload(payload) {
  return new Promise((resolve, reject) => {
    if (payload && payload.errorMessage) {
      reject(payload.errorMessage)
    } else {
      resolve(payload)
    }
  })
}