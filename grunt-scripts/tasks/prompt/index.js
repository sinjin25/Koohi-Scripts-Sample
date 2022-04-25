module.exports = {
    "amazon-download": require('./amazon-download.json'),
    "prompt-example": require('./prompt-example.json'),
    ...require('./amazon-extract'),
    ...require('./move-files')
}