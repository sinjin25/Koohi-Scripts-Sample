// check a (JSON) file and check if it has the keys in a supplied list of required keys

require('colors')
const path = require('path')

module.exports = function checkRequiredKeys(file, required = []) {
    // ensure destination
    let missing = []
    try {
        const contents = require(file)
        // check against REQUIRED_KEY0
        const fileKeys = Object.keys(contents)
        required.forEach((i, indx) => {
            if (fileKeys.includes(i) === false) missing.push(`[${indx+1}] ${i}`)
        })
        return missing
    } catch(e) {
        console.error(e)
    } finally {
        return missing
    }
}