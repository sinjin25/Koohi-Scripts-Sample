module.exports = function(dest) {
    const fse = require('fs-extra')
    // setup output stream
    const output = fse.createWriteStream(dest)
    return output
}