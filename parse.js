// extract message from the event. two possible event sources are SNS and HTTP. 
// We need to inspect the event contents to determine which one it's from and parse them accordingly.
module.exports = event => {
	if (event['Records']) {
		return parseSnsEvent(event)
	} 
	if (event['body']) {
		return parseHttpEvent(event)
	}

	return parseUnknownEvent(event)
}

function parseSnsEvent(event) {
	var source = 'sns'
	var messages = event['Records'].map(r => r['Sns']['Message'])

	return Promise.all(messages.map(_parseJson))
		.then(items => ({ source, items }))
}

function parseHttpEvent(event) {
	var source = 'http'
	var message = event['body']

	return _parseJson(message)
		.then(item => ({ source: 'http', items: [ item ] }))
}

function parseUnknownEvent(event) {
	return _parseJson(event)
		.then(item => ({ source: 'unknown', items: [ item ] }))
}

function _parseJson(body) {
	return new Promise((resolve, reject) => {

		if (typeof body == 'object') {
			return resolve(body)
		}

		try {
      resolve(JSON.parse(body))
  	} catch (e) {
    	reject(e)
  	}
	})
}