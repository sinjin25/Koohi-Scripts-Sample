const grunt = require('grunt')
module.exports = (keys, as) => {
    const [key, fallback = null] = keys
    return function(obj) {
        const value = fallback ? grunt.myGetConfig(key, fallback) : grunt.config.get(key)
        return {
            ...obj,
            [as || key]: value
        }
    }
}