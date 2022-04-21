require('colors')
const fse = require('fs-extra')
const path = require('path')

const config = require('../02-move-files/config.json')
const { JSONdump } = config

const COLUMNS = ['filename', 'score']
const LOG_DESTINATION = path.join(JSONdump, 'readability-log.csv')
const APPEND_FAIL = 'There was an error writing to the log'

function logReadability(row) {
    return fse.pathExists(LOG_DESTINATION)
    .catch(() => {
        const data = COLUMNS.join('\t')
        return fse.writeFile(LOG_DESTINATION, 'utf8', `${data}\n`)
    })
    .then(() => {
        const {
            filename,
            score
        } = row
        const insertRow = [
            filename.replace(/ read$/, ''),
            score.slice(0, 5) //str not number
        ].join('\t')
        return fse.appendFile(LOG_DESTINATION, `${insertRow}\n`)
    })
    .catch((err) => {
        console.log(APPEND_FAIL, row, err)
    })
}

module.exports = logReadability