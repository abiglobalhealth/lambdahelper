"use strict";

var lambdaProxyResponse = require('./lambdaProxyResponse')
var parse = require('./parse')

module.exports = handler => (event, context, callback) => {

	var _processAndMergeResults = ev => {	
		if (!handler || typeof handler !== 'function') 
			throw new Error('missing handler or is not a function')

		return Promise.all(ev.items.map(handler))
			.then(results => Object.assign({}, ev, { results }))
	}

	var _formatResponse = ev => ev.source == 'http' ? lambdaProxyResponse(ev.results) : ev.results

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