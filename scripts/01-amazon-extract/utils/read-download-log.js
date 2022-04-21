const fse = require('fs-extra')
const path = require('path')
const config = require('../config.json')
const {
    destination
} = config

function findInLogs(filename) {
    return fse.readFile(path.join(destination, 'download-log.csv'), 'utf-8')
    .then(contents => {
        const data = contents.split('\n')
        .map(i => i.split('\t'))
        const found = data.filter(i => {
            if (i.length < 2) return false
            return i[1] === filename
        })
        if (found.length === 0) return Promise.reject('not found')
        return found.slice(-1)[0][0] // latest one
    })
}

module.exports = findInLogs