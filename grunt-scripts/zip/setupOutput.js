module.exports = function(dest) {
    const fse = require('fs-extra')
    // setup output stream
    const output = fse.createWriteStream(dest)
    output.on('close', () => {
        console.log(`Archived ${categoryFolder} ${archiveName}`)
        console.log(`Total bytes in zip: ${archive.pointer()}`)
        console.log(`Archiving is now finished`)
    })
    return output
}