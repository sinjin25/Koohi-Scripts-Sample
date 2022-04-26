/**
 * Read all the files in the src directory. Filter ones that are about readability.
 */
module.exports = function(src) {
    const path = require('path')
    const fse = require('fs-extra')
    const PATTERN = / read.txt$/
    return fse.readdir(src, {encoding: 'utf-8'})
    .then((files) => files.filter((i) => i.match(PATTERN)))
    .catch((err) => {
        console.log(`Error reading readability dump folder ${src}`)
        console.log(err)
        return Promise.reject(err)
    })
    .then((files) => {
        const fileContents = []
        files.forEach((aFile) => {
            fileContents.push(
                fse.readFile(path.join(src, aFile), 'utf8')
            )
        })
        return Promise.allSettled(fileContents)
    })
}