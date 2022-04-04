// create an abridged dictionary table
// no point in doing transactions because the table creation will autocommit anyway

require('colors')
const setupDb = require('../../util/db.js')
const getItems = require('./get-items.js')
const definitionTransform = require('../../util/definitionTransform.js')
const config = require('../../config.json')
const { delimiter } = require('../config.json')
const MyQueue = require('../../util/queue.js')

module.exports = async function(opts) {
    // setup db
    const myDb = await setupDb(config)
    .then((result) => {
        console.log('Db pool created. This should only happen once.'.blue)
        return result
    })
    .catch((err) => {
        return Promise.reject(err)
    })

    // select items from jmdict
    const queue = new MyQueue()
    console.log('awaiting getItems'.blue)
    await getItems(myDb, {offset: opts.offset, rows: opts.rows})
    .then(([data]) => {
        data.forEach((i) => {
            const lines = definitionTransform(i.definition)
            .map((str) => {
                return `${i.kanji}${delimiter}${i.dictNum}${delimiter}${str}`
            })
            queue.tasks.push(function(cb) {
                opts.stream.write(`${lines.join('\n')}\n`, cb)
            })
        })
    })
    .catch((err) => {
        return Promise.reject(err)
    })

    queue.next()
    queue.canFinish()
    return new Promise((resolve, reject) => {
        const cb = () => {
            console.log('Queue emptied'.red)
            resolve('done')
        }
        queue.on('finish', cb)
    })
}