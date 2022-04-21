require('colors')
const fse = require('fs-extra')
const path = require('path')
const config = require('../01-amazon-extract/config.json')
const { destination } = config

const COLUMNS = ['url', 'json output name']
const LOG_DESTINATION = path.join(destination, 'download-log.csv')
const APPEND_FAIL = 'There was an error writing to the log'
const LOG_PRECHECK_FAIL = 'Missing required parameters for logUrl'

function logUrl(url, outputFileName) {
    // precheck
    if (!url || !outputFileName) return Promise.reject(Error(LOG_PRECHECK_FAIL))
    // check if file exists
    return fse.pathExists(LOG_DESTINATION)
    .catch(() => {
        // create file
        const data = [
            COLUMNS.join('\t'),
        ].join('\n')
        return fse.writeFile(LOG_DESTINATION, 'utf-8', data)
    })
    .then(() => {
        // update file
        const data = `${[url, outputFileName].join('\t')}\n`
        fse.appendFile(LOG_DESTINATION, data)
    })
    .catch(() => {
        console.log(APPEND_FAIL, url, json)
    })
}

module.exports = logUrl