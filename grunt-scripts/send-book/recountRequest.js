module.exports = function(options) {
    const fetch = require('node-fetch')
    const {
        RECOUNT_URL
    } = options
    if (!RECOUNT_URL) throw Error('Missing required option "RECOUNT_URL"')

    return fetch(RECOUNT_URL)
}