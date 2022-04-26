/**
 * Receive the formatted data from a xxx read.txt file, file it into a log
 */
module.exports = function(dest, data) {
    const fse = require('fs-extra')
    
    const COLUMNS = ['filename', 'score']
    const APPEND_FAIL = 'There was an error writing to the log'

    return fse.pathExists(dest)
    .catch(() => {
        const data = COLUMNS.join('\t')
        return fse.writeFile(dest, 'utf8', `${data}\n`)
    })
    .then(() => {
        const { filename, score } = data
        const insertRow = [
            filename, // point to file its based off of
            score.slice(0, 5)
        ].join('\t') // its a csv file so split columns by tab
        console.log('asfdasdf', insertRow, dest)
        return fse.appendFile(
            dest,
            `${insertRow}\n`
        )
    })
    .catch((err) => {
        console.log(APPEND_FAIL, data, err)
    })
}