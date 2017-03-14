var test = require('blue-tape')
var response = require('../lambdaProxyResponse')

test('response(): returns stringified body with header and status code', assert => {
	assert.plan(1)

	var item = {
		purpose: 'you pass butter',
	}

	var expected = {
		statusCode: 200,
		headers: {
			"Content-Type" : "application/json",
		},
		body: JSON.stringify(item),
	}

	assert.deepEqual(response(item), expected)
})


test('response(): doesnt double stringify if item is already a string', assert => {
	assert.plan(1)

	var item = 'you pass butter'

	var expected = {
		statusCode: 200,
		headers: {
			"Content-Type" : "application/json",
		},
		body: 'you pass butter',
	}

	assert.deepEqual(response(item), expected)
})

test('response(): handles error responses', assert => {
	assert.plan(1)

	var item = new Error('oh my god...')

	var expected = {
		statusCode: 400,
		headers: {
			"Content-Type" : "application/json",
		},
		body: JSON.stringify({ error: 'oh my god...'}),
	}

	assert.deepEqual(response(item), expected)
})
