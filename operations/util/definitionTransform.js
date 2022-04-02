module.exports = function definitionTransform(str) {
    // receive a string
    // transform into multiple rows based on delimiter + clean data
    const cleaned = str.replace(/\((.*?)\)/g, '')
                .trim()
    return cleaned.split(',')
    .map((i) => i.trim())
    .filter((i) => i)
}
