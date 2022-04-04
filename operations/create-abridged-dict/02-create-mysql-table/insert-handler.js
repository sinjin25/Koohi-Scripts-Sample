const insertData = require('./insert-data.js')
const fse = require('fs-extra')

// handle chunks from reading the csv
module.exports = (queue, rows, db) => {
    // split into chunks of 100
    
    const subRow = []
    let subRowPointer = 0
    const subRowLen = 50
    for(let i = 0; i < rows.length; i++) {
        if (subRow.length === 0 || subRow[subRowPointer].length % subRowLen === 0) {
            subRow.push([])
            subRowPointer = subRow.length - 1
        }
        const row = rows[i]
        if (row.length === 3) subRow[subRowPointer].push(row)
    }
    fse.writeJSONSync('debug.json', subRow, {
        spaces: 4,
    })
    // add tasks
    subRow.forEach((i) => {
        if (subRow.length > 1) {
            queue.tasks.push(function(cb) {
                return insertData(db, i)
                .then(() => {
                    return cb()
                })
            })
        }
    })
}