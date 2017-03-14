
module.exports = res => {
	var isError = res instanceof Error

	if (isError) {
		return {
			body: JSON.stringify({error: res.message}),			
			statusCode: 400,
			headers: {
				"Content-Type" : "application/json",
			},
		}
	}

	var body = typeof res == 'object' ? JSON.stringify(res) : res
	
	return {
		body,
		statusCode: 200,
		headers: {
			"Content-Type" : "application/json",
		},
	}
}
