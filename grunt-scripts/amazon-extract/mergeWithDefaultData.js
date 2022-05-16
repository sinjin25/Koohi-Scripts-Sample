const defaultJSONData = require('./defaultJSONData')
module.exports = function(data) {
    console.log('default', defaultJSONData)
    return {
        ...defaultJSONData,
        ...data,
    }
}