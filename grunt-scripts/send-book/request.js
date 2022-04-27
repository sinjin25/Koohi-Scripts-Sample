module.exports = function(data, options) {
    const fetch = require('node-fetch')
    const {
        BASE_URL,
        PASS,
    } = options

    if (!BASE_URL) throw Error('Missing required option "BASE_URL"')
    if (!PASS) throw Error('Missing required option "PASS"')

    const requiredKeys = [
        'filename',
        'title',
        'medium',
        'vocab_list',
        'title_jp',
        'readability',
        'permission'
    ]
    requiredKeys.forEach((i) => {
        if (i in data === false) throw Error(`Missing required key: "${i}"`)
    })

    const url = `${BASE_URL}?pass=${PASS}&filename=${data.filename}&title=${data.title}&medium=${data.medium}&vocab_list=${data.vocab_list}&title_jp=${data.title_jp}&readability=${data.readability}&permission=${data.permission}`
    return fetch(url)
    .then((res) => {
        if (res.ok) return res.json()
        throw res
    })
    .catch((res) => {
        console.error('e', res)
        return res
    })
}