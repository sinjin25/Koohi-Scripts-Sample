require('colors')
const REQUIRED_KEYS = [
    'readability',
    'permission',
    'title',
    'filename',
    'medium',
    'vocab_list',
    'title_jp',
].sort((a, b) => {
    if (a > b) return 1
    if (a === b) return 0
    if (a < b) return -1
})

const CHOICES = [
    ...REQUIRED_KEYS,
    // optional
    ...[
    'info',
    'buy',
    'episodes',
    'aired'
    ]
]

module.exports = function(data) {
    // find missing keys
    let missing = []
    REQUIRED_KEYS.forEach((aKey) => {
        if (aKey in data === false || !data[aKey]) missing.push(aKey)
    })
    return {
        CHOICES,
        missing,
    }
}