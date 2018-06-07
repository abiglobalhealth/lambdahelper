var qs = require('querystring')
// extract message from the event. two possible event sources are SNS and HTTP. 
// We need to inspect the event contents to determine which one it's from and parse them accordingly.
module.exports = event => {
	if (event['Records']) {
		return parseSnsEvent(event)
	} 
	if (event['body'] && event['httpMethod']) {
		return parseHttpEvent(event)
	}

	return parseUnknownEvent(event)
}

function parseSnsEvent(event) {
	var source = 'sns'
	var messages = event['Records'].map(r => r['Sns']['Message'])

	return Promise.all(messages.map(_parseJson))
		.then(parsed => ({ source, parsed }))
		.catch(() => parseUnknownEvent(event))
}

function parseHttpEvent(event) {
	var source = 'http'
	var message = event['body']

	return _parseJson(message)
		.then(parsed => ({ source, parsed }))
		.catch(() => parseUnknownEvent(event))
}

function parseUnknownEvent(event) {
	return _parseJson(event)
		.then(parsed => ({ source: 'unknown', parsed }))
}

function _parseJson(body) {
	return new Promise((resolve, reject) => {

		if (typeof body == 'object') {
			return resolve(body)
		}

		try {
      resolve(JSON.parse(body))
  	} catch (e) {
  		try {
  			resolve(qs.parse(body))
  		} catch (e) {
	  		console.log(e)
	    	reject(e)  			
  		}
  	}
	})
}