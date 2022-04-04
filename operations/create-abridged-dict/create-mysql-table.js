// db
const setupDb = require('../util/db.js')
const config = require('../config.json')
// table setup
const tableSetup = require('./02-create-mysql-table/table-setup.js')
// insert
const insertData = require('./02-create-mysql-table/insert-data.js')
// node
const fse = require('fs-extra')
const path = require('path')
const MyQueue = require('../util/queue.js')

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
        let queueStarted = false
        queue.on('finish', () => {
            console.log('Queue emptied'.red)
            resolve('done')
        })

        // setup stream
        const csvStream = fse.createReadStream(path.join('output.example.csv'), 'utf8')
        csvStream.on("error", err => reject(err))
        csvStream.on("data", chunk => {
            const rows = chunk.split('\n')
            .map(i =>  {
                return i
                .split('\t')
                .filter((o, index) => index !== 0)
            })
            console.log('chunk read, pushing task'.blue)
            queue.tasks.push(function(cb) {
                insertData(theDb, rows)
                .then(() => cb())
                .catch(reject)
            })
            if (!queueStarted) {
                queueStarted = true
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