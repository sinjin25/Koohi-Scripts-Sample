// require path
// require fs
// create folder if path doesn't exist
// create file if file doesn't exist
// modify file
    // rewrite file

require('colors')
const path = require('path')
const fse = require('fs-extra')

const JSON_WHITE_SPACE = 4;

module.exports = function addMeta(destination, file, key, value) {
    // ensure destination
    fse.ensureDirSync(destination)
    fse.ensureFileSync(path.join(destination, file))

    // open file
    const contents = require(path.join(destination, file))

    // modify object
    const workingKey = Array.isArray(key) ? [...key] : [key]
    const workingValue = Array.isArray(value) ? [...value] : [value]
    for (let i = 0; i < key.length; i++) {
        const item = {
            key: workingKey[i],
            value: workingValue[i],
        }
        if (!item.value | !item.key) continue;
        contents[item.key] = item.value
    }

    // write file
    fse.writeFileSync(
        path.join(destination, file),
        JSON.stringify(contents, null, JSON_WHITE_SPACE)
    )
}