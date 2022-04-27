const fse = require('fs-extra')

const COLUMNS = ['url', 'json output name']
const APPEND_FAIL = 'There was an error writing to the log'
const LOG_PRECHECK_FAIL = 'Missing required parameters for logUrl'
module.exports = function(url, outputFileName, dest) {
    // precheck
    if (!url || !outputFileName) return Promise.reject(Error(LOG_PRECHECK_FAIL))
    // check if file exists
    return fse.pathExists(`${dest}/download-log.csv`)
    .catch(() => {
        // create file
        const data = [
            COLUMNS.join('\t'),
        ].join('\n')
        return fse.writeFile(`${dest}/download-log.csv`, 'utf-8', data)
    })
    .then(() => {
        // update file
        const data = `${[url, outputFileName].join('\t')}\n`
        fse.appendFile(`${dest}/download-log.csv`, data)
    })
    .catch(() => {
        console.log(APPEND_FAIL, url, json)
    }) 
}