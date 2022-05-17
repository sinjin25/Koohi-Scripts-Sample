// a pipe for simple debugging
require('colors')
module.exports = (pipedData) => {
    console.log('debug pipe:'.red, pipedData)
    return pipedData
}