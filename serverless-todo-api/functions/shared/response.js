module.exports = {
    success: (data, statusCode = 200) => ({
        statusCode,
        body: JSON.stringify(data)
    }),
    error: (message, statusCode = 500) => ({
        statusCode,
        body: JSON.stringify({ error: message })
    })
};