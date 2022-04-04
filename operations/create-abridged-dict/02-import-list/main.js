const createDictTable = require('./create-dict-table.js')

// create dict table
console.log('awaiting createDictTable'.blue)
await createDictTable(myDb)
.then((result) => {
    console.log('finished createDictTable'.blue, result)
})
.catch((err) => {
    return Promise.reject(err)
})
