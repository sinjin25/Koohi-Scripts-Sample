module.exports = {
    "amazon-download": require('./amazon-download.json'),
    "prompt-example": require('./prompt-example.json'),
    "zip": require('./zip.json'),
    "send-book": require('./send-book.json'),
    "simple-confirm": require('./simple-confirm.json'),
    "simple-loop-confirm": require('./simple-loop-confirm.json'),
    ...require('./modify-book'),
    ...require('./amazon-extract'),
    ...require('./move-files'),
    ...require('./rename-raw-files'),
}