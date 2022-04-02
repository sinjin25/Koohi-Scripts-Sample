// get items from jmdict

module.exports = function(db, offset, rowsPerQuery) {
    console.log('attempting query')
    console.log(`SELECT kanji, dictNum, definition from data_jmdict LIMIT ${offset} OFFSET ${rowsPerQuery}`)
    return db.query(`SELECT kanji, dictNum, definition from data_jmdict LIMIT ${offset} OFFSET ${rowsPerQuery}`)
}