// get items from jmdict

module.exports = function(db, opts) {
    const {
        offset,
        rows:rowsPerQuery,
    } = opts
    if (!db || typeof offset !== 'number' || !rowsPerQuery) throw Error(`Missing required option. Received: ${JSON.stringify(opts)}`)
    console.log('attempting query')
    console.log(`SELECT kanji, dictNum, definition from data_jmdict LIMIT ${rowsPerQuery} OFFSET ${offset}`)
    return db.query(`SELECT kanji, dictNum, definition from data_jmdict LIMIT ${rowsPerQuery} OFFSET ${offset}`)
}