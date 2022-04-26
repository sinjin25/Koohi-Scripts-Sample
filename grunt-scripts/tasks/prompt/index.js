module.exports = {
    "amazon-download": require('./amazon-download.json'),
    "prompt-example": require('./prompt-example.json'),
    "zip": require('./zip.json'),
    ...require('./amazon-extract'),
    ...require('./move-files'),
    ...require('./rename-raw-files'),
}