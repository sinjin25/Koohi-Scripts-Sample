module.exports = function(filename, tests) {
    if (Array.isArray(tests) === false) throw Error('Please supply tests as an array')
    for (let i = 0; i < tests.length; i++) {
        const m = tests[i]
        if (filename.match(m) !== null) return true
    }
    return false
}