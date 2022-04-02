// create an abridged dictionary table
// no point in doing transactions because the table creation will autocommit anyway

require('colors')
const setupDb = require('../util/db.js')
const createDictTable = require('./create-dict-table.js')
const getItems = require('./get-items.js')
const definitionTransform = require('../util/definitionTransform.js')
const config = require('../config.json')
const fse = require('fs-extra')
const util = require('util')
const MyQueue = require('../util/queue.js')

async function main(offset, rowsPerQuery) {
    // setup db
    const myDb = await setupDb(config)
    .then((result) => {
        console.log('Db pool created. This should only happen once.'.blue)
        return result
    })
    .catch((err) => {
        return Promise.reject(err)
    })

    // create dict table
    console.log('awaiting createDictTable'.blue)
    await createDictTable(myDb)
    .then((result) => {
        console.log('finished createDictTable'.blue, result)
    })
    .catch((err) => {
        return Promise.reject(err)
    })

    // select items from jmdict
    const queue = new MyQueue()
    console.log('awaiting getItems'.blue)
    await getItems(myDb, offset, rowsPerQuery)
    .then(([rows, fields]) => {
        rows.forEach((i) => {
            const lines = definitionTransform(i.definition)
            .map((str) => {
                return `${i.kanji}|${i.dictNum}|${str}`
            })
            /* writeStream.write(lines.join('\n')) */
            queue.tasks.push(function(cb) {
                writeStream.write(`${lines.join('\n')}\n`, cb)
            })
        })
    })
    .catch((err) => {
        return Promise.reject(err)
    })

    queue.next()
    queue.canFinish()
    const x = new Promise((resolve, reject) => {
        const cb = () => {
            console.log('Queue emptied'.red)
            resolve('done')
        }
        queue.on('finish', cb)
    })
    return x
}

// erase and write new file
const writeStream = fse.createWriteStream('test.txt', {flags: 'w'})

const loop = (offset, rows) => {
    if (offset > 284167) return Promise.reject('Out of results')
    return main(offset, rows)
    .then((result) => {
        console.log(result.green)
        index++
        return loop(index*rows, rows)
    })
    .catch((err) => Promise.reject(err))
}
let index = 1
const rows = 50000
loop(index*rows, rows)
.catch((err) => {
    console.log(err.red)
})