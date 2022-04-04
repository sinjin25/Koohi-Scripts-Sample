// db
const setupDb = require('../util/db.js')
const config = require('../config.json')
// table setup
const tableSetup = require('./02-create-mysql-table/table-setup.js')
// node
const fse = require('fs-extra')
const path = require('path')
const MyQueue = require('../util/queue.js')
const insertHandler = require('./02-create-mysql-table/insert-handler.js')
const chunkHandler = require('./02-create-mysql-table/chunk-handler.js')

setupDb(config)
.then((theDb) => {
    console.log('Db pool created. This should only happen once.'.blue)
    return theDb
})
.then((theDb) => {
    return tableSetup(theDb)
    .then(() => theDb)
    .catch((err) => Promise.reject(err))
})
.then((theDb) => {
    return new Promise((resolve, reject) => {
        // setup queue
        const queue = new MyQueue()
        queue.concurrency = 5
        queue.notificationOn = 25
        let queueStarted = false
        queue.on('finish', () => {
            console.log('Queue emptied'.red)
            resolve('done')
        })

        // setup stream
        const csvStream = fse.createReadStream(path.join('output.csv'), 'utf8')
        csvStream.on("error", err => reject(err))
        csvStream.on("data", chunk => {
            const rows = chunkHandler(chunk)
            insertHandler(queue, rows, theDb)
            if (!queueStarted) {
                queueStarted = true
                console.log('starting queue')
                queue.next()
            }
        })
        csvStream.on("end", () => {
            queue.canFinish()
        })
    })
})
.then(() => {
    console.log("Operation completed".green)
    process.exit(0)
})
.catch((err) => {
    console.log(err)
})