var test = require('blue-tape')
var parseInvokeResponse = require('../parseInvokeResponse')

test('parseInvokeResponse(): rejects if StatusCode is not 200 or 201', assert => {
	var invokeRes = {
		StatusCode: 500,
		ErrorMessage: 'server error'
	}

	return parseInvokeResponse(invokeRes)
		.catch(e => assert.equal(e, invokeRes))
})


test('parseInvokeResponse(): rejects payload is not an JSON string', assert => {
	var invokeRes = {
		StatusCode: 200,
		Payload: 'cantparsethis'
	}

	return parseInvokeResponse(invokeRes)
		.catch(e => assert.equal(e.name, 'SyntaxError'))
})

test('parseInvokeResponse(): rejects if payload contains error message', assert => {
	var invokeRes = {
		StatusCode: 200,
		Payload: JSON.stringify({ errorMessage: 'your lambda rejected, bitch' })
	}

	return parseInvokeResponse(invokeRes)
		.catch(e => assert.equal(e, 'your lambda rejected, bitch'))
})

test('parseInvokeResponse(): passes and returns parsed payload for 200 response', assert => {
	var item = { success: 'nice' }

	var invokeRes = {
		StatusCode: 200,
		Payload: JSON.stringify(item)
	}

	return parseInvokeResponse(invokeRes)
		.then(res => assert.deepEquals(res, item))
})

test('parseInvokeResponse(): passes and returns parsed payload for 201 response', assert => {
	var item = { success: 'nice' }

	var invokeRes = {
		StatusCode: 201,
		Payload: JSON.stringify(item)
	}

	return parseInvokeResponse(invokeRes)
		.then(res => assert.deepEquals(res, item))
})