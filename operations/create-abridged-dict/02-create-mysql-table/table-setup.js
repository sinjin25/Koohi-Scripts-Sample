require('colors')
const createDictTable = require('./create-dict-table.js')
const dropDictTable = require('./drop-dict-table.js')

module.exports = async function(myDb) {

    console.log('dropping old dict table'.blue)
    await dropDictTable(myDb)
    .then((result) => {
        console.log('finished dropping dict table'.blue, result)
    })
    .catch((err) => {
        return Promise.reject(err)
    })
    
    console.log('awaiting createDictTable'.blue)
    await createDictTable(myDb)
    .then((result) => {
        console.log('finished creating dict table'.blue, result)
    })
    .catch((err) => {
        return Promise.reject(err)
    })
    return
}