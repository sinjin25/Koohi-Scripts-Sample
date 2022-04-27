/**
 * Get the files in a folder, recursively.
 * @param {string} src
 * @param {Function} filter
 * @returns {Array} - items have name, path, ext
 */
function findFilesInDirectory(src, filter, MAX_DEPTH = 5) {
    // closure for holding all the info from the recursive calling
    const results = []
    const actions = [] // inform when completed
    function findFilesInDirectory__recursive(src, filter, index = 0) {
        const path = require('path')
        const fse = require('fs-extra')
        if (index >= MAX_DEPTH) return Promise.resolve()
        return fse.readdir(src, { withFileTypes: true})
        .then((items) => {
            // files
            // default filter
            const defaultFilter = function(anItem) {
                return anItem.isFile()
            }
            const files = items
                .filter(filter || defaultFilter)
                .map(aFile => formatFiles(src, aFile))
            results.push(...files)
            const directories = items.filter((anItem) => anItem.isDirectory())
            // directories
            directories.forEach((aDirectory) =>  {
                const recursive = findFilesInDirectory__recursive(
                    path.join(src, aDirectory.name),
                    filter,
                    index+1
                )
                actions.push(recursive)
            })
        })
        .catch((err) => {
            console.warn(err)
        })
    }
    function formatFiles(src, fileObj) {
        const path = require('path')
        return {
            name: fileObj.name,
            path: path.join(src, fileObj.name),
            ext: fileObj.name.split('.').pop()
        }
    }
    // main
    return findFilesInDirectory__recursive(src, filter)
    .then(() => { // make sure it can get to the end of the first recursion level so function does not end prematurely
        actions.push(Promise.resolve())
        return Promise.all(actions)
    })
    .then(() => {
        return results
    })
}
// example
/* findFilesInDirectory("C:\\Users\\Sinj\\Downloads\\release 4-20", function(anItem) {
    return anItem.isFile() && anItem.name.split('.').pop() === 'csv'
}) */
module.exports = findFilesInDirectory