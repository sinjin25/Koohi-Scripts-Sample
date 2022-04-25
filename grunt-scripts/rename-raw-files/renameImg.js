require('colors')

module.exports = function(src, regex, newName) {
    const fse = require('fs-extra')
    return fse.readdir(src)
    .then((files) => files.filter((i) => i.match(regex)))
    .then((files) => {
        // accept first file
        if (files.length === 0) return Promise.reject('Could not find a file named "cover"')
        // get extension
        const theFile = files[0]
        const ext = theFile.split('.').pop()
        return [theFile, ext]
    })
    .then(([theFile, ext]) => {
        const path = require('path')
        const filePath = path.join(
            src,
            theFile
        )
        const newFilePath = path.join(
            src,
            `${newName}.${ext}`
        )
        return fse.rename(filePath, newFilePath)
        .then(() => {
            console.log(`Successfully renamed ${theFile} to ${newName}.${ext}`.blue)
        })
    })
    .catch((err) => {
        console.log(`Error trying to rename cover img`.red)
        console.log(err)
        return Promise.reject(err)
    })
}