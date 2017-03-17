"use strict";

var lambdaProxyResponse = require('./lambdaProxyResponse')
var parse = require('./parse')

module.exports = handler => (event, context, callback) => {

	var _processAndMergeResults = ev => {	
		if (!handler || typeof handler !== 'function') 
			throw new Error('missing handler or is not a function')

		if (Array.isArray(ev.parsed)) {
			return Promise.all(ev.parsed.map(handler))
				.then(result => Object.assign({}, ev, { result }))
		} 

		return Promise.resolve(ev.parsed)
			.then(handler)
			.then(result => Object.assign({}, ev, { result }))
	}

	var _formatResponse = ev => ev.source == 'http' ? lambdaProxyResponse(ev.result) : ev.result

	return parse(event)
		.then(_processAndMergeResults)
		.then(_formatResponse)
		.then(res => {
			if (callback) callback(null, res)
			return res
		})
		.catch(e => {
			if (callback) callback(e)	
			throw e
		})
}