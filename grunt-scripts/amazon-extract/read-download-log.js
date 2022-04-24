const fse = require('fs-extra')
const path = require('path')

function findInLogs(dest, filename) {
    return fse.readFile(path.join(dest, 'download-log.csv'), 'utf-8')
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