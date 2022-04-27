module.exports = function(data) {
    require('colors')
    const keys = [
        'cover',
        'series',
        'description',
        'author',
        'title',
        'title_jp',
        'info',
        'permission',
        'vocab_list',
        'filename',
    ]
    keys.forEach((aKey) => {
        if (aKey in data) {
            console.log(`${aKey}:`.blue, `${data[aKey]}`.green)
        } else {
            console.log(`${aKey}: MISSING`.red)
        }
    })
    return data
}