module.exports = function(data, options) {
    const fetch = require('node-fetch')
    const {
        FIELDS, JSON_MAP
    } = require('./fieldMap')
    const {
        META_URL,
        PASS,
        insertId,
    } = options

    
    if (!META_URL) throw Error('Missing required option "META_URL"')
    if (!PASS) throw Error('Missing required option "PASS"')
    if (!insertId) throw Error('Missing required option "insertId"')
    
    const url = `${META_URL}`

    const body = {
        pass: PASS,
        bookId: insertId,
    }
    for (const [key, mappedKey] of Object.entries(JSON_MAP)) {
        if (mappedKey in data) body[key] = data[mappedKey]
    }
    console.log(body)
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => {
        if (res.ok) return res.json()
        throw res
    })
    .catch((res) => {
        console.error('e', res)
        return res
    })
}