const CORE_CHOICES = [
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
    ...CORE_CHOICES,
    // optional
    ...[
    'info',
    'buy',
    'episodes',
    'aired'
    ]
]

const REQUIRED_KEYS = [
    ...CORE_CHOICES
]

module.exports = {
    NO_CHOICE_SELECTED: -1,
    JSON_WHITE_SPACE: 4,
    CHOICES,
    REQUIRED_KEYS,
}