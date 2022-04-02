require('colors')
const fse = require('fs-extra')
const main = require('./main.js')

// erase and write new file
const writeStream = fse.createWriteStream('test.txt', {flags: 'w'})

// recursive handling
const loop = (offset, rows, stream) => {
    if (offset > 284167) return Promise.reject('Out of results') // magic number
    return main(offset, rows, stream)
    .then((result) => {
        console.log(result.green)
        index++
        return loop(index*rows, rows, stream)
    })
    .catch((err) => Promise.reject(err))
}

let index = 1
const rows = 50000
loop(index*rows, rows, writeStream)
.catch((err) => {
    console.log(err)
})