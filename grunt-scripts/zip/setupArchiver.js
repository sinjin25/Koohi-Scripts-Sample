module.exports = function(stream, opts) {
    const archiver = require('archiver')
    const { level } = opts
    const archive = archiver('zip', {
        zlib: { level }
    })
    archive.on('error', err => {
        throw err;
    })
    archive.pipe(stream)
    return archive
}