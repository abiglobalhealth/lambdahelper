var test = require('blue-tape')
var handler = require('../handler')

var item = {
	action: 'pass the butter'
}

test('handler(): parses message from event', assert => {
	var event = JSON.stringify(item)
		
	return handler(i => i)(event)
		.then(res => assert.deepEquals(res, item))
})

test('handler(): processes items thru message handler', assert => {
	var h = i => Object.assign({}, i, { didProcess: true })
	
	var expected = {
		action: 'pass the butter',
		didProcess: true,
	}

	return handler(h)(item)
		.then(res => assert.deepEquals(res, expected))
})

test('handler(): formats response for api gateway lambdaProxy event', assert => {
	var event = { body: JSON.stringify(item) }
	
	var expected = {
		statusCode: 200,
		headers: {
			"Content-Type" : "application/json",
		},
		body: JSON.stringify(item),
	}

	return handler(i => i)(event)
		.then(res => assert.deepEquals(res, expected))
})

test('handler(): sends result to callback', assert => {
	var event = JSON.stringify(item)
	
	return handler(i => i)(event, null, (err, res) => {
		assert.deepEquals(res, item)
	})
})

test('handler(): sends error to callback and rejects promise', assert => {
	assert.plan(2)
	
	var h = i => {
		throw new Error('some error')
	}

	var event = JSON.stringify(item)

	return handler(h)(event, null, (err, res) => {
		assert.equal(err.message, 'some error')
	}).catch(e => {
		assert.equal(e.message, 'some error')
	})
})