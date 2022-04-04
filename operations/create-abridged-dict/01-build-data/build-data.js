require('colors')
const fse = require('fs-extra')
const main = require('./main.js')
const path = require('path')
const { rowsPerQuery } = require('../config.json')

// erase and write new file
const writeStream = fse.createWriteStream(path.join('..', 'output.csv'), {flags: 'w'})

// recursive handling
const loop = (opts) => {
    const { offset, rows, stream } = opts
    if (offset > 284167) return Promise.reject('Out of results') // magic number
    return main({ offset, rows, stream })
    .then((result) => {
        console.log(result.green)
        index++
        return loop({
            offset: rowsPerQuery*index,
            rows: rowsPerQuery,
            stream: writeStream
        })
    })
    .catch((err) => Promise.reject(err))
}

let index = 0
//rowsPerQuery, index*rowsPerQuery, writeStream
loop({
    offset: rowsPerQuery*index,
    rows: rowsPerQuery,
    stream: writeStream
})
.catch((err) => {
    console.log(err)
})