module.exports = {
    FIELDS: [
        'series',
        'image',
        'episodes',
        'aired',
        'info',
        'buy',
        'desc',
    ],
    JSON_MAP: { // map FIELDS to JSON properties
        'series': 'series',
        'image': 'cover',
        'episodes': 'episodes',
        'aired': 'aired',
        'info': 'info',
        'buy': 'buy',
        'desc': 'description'
    },
    JSON_WHITE_SPACE: 4,
}