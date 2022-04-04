module.exports = function (db) {
    return db.query(
    `DROP TABLE if exists \`flfl_books\`.\`data_search_dict\``
    )
}