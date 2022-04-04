// take an object, create question marks equal to the number of values you need
// INSERT INTO (a, b, c) VALUES (?, ?, ?)

module.exports = function(input) {
    if (typeof input !== "object") throw "Expected an object or array"
    // array
    if (Array.isArray(input) === true) return input.map(i => `?`)

    // object
    const keys = Object.keys(input)
    return keys.map(i => `?`)
}