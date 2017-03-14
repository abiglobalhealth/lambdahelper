var test = require('blue-tape')
var parse = require('../parse')

var message = {
	service_name: 'messenger',
	service_user_id: '123456',
	text: 'hello!'
}

test('parse(): parses an http event', assert => {
	var event = {
		body: JSON.stringify(message),
	}

	var expected = {
		source: 'http',
		items: [ message ],
	}

	return parse(event)
		.then(res => assert.deepEqual(res, expected))
})

test('parse(): parses an http event where the body is aleady an object', assert => {
	var event = {
		body: message
	}

	var expected = {
		source: 'http',
		items: [ message ],
	}

	return parse(event)
		.then(res => assert.deepEqual(res, expected))
})

test('parse(): parses an sns event', assert => {
	var event = {
		'Records': [
			{'Sns': { 'Message': JSON.stringify(message)}}
		]
	}

	var expected = {
		source: 'sns',
		items: [ message ],
	}

	return parse(event)
		.then(res => assert.deepEqual(res, expected))
})


test('parse(): parses unknown source where event is an object', assert => {
	var expected = {
		source: 'unknown',
		items: [ message ],
	}

	return parse(message)
		.then(res => assert.deepEqual(res, expected))
})

test('parse(): parses unknown source where event is a string', assert => {
	var event = JSON.stringify(message)
	
	var expected = {
		source: 'unknown',
		items: [ message ],
	}

	return parse(event)
		.then(res => assert.deepEqual(res, expected))
})
