module.exports = function(opts = {}) {
    const path = require('path')
    const fse = require('fs-extra')

    const {
        src, loc, file
    } = opts
    if (!src || !loc || !file) throw Error('Missing required option')
    if (Array.isArray(loc) === false) throw Error('loc option should be an array')

    const actions = []
    loc.forEach(destination => {
        console.log(`Copying ${file} to ${destination}`)
        actions.push(fse.copy(
            path.join(src, file),
            path.join(destination, file)
        ))
    })

    return Promise.all(actions)
}