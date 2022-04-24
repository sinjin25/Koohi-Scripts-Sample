const HTMLParser = require('node-html-parser')
const Extractor = require('./Extractor')


module.exports = function(fileContents) {
    const root = HTMLParser.parse(fileContents)
    const bookInfo = {}
    Extractor.routine(root, bookInfo)

    return bookInfo
}