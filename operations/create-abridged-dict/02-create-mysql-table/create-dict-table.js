module.exports = function (db) {
    return db.query(
    `CREATE TABLE if not exists \`flfl_books\`.\`data_search_dict\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`dictNum\` INT NOT NULL,
        \`definition\` VARCHAR(300) NOT NULL,
        PRIMARY KEY (\`id\`));
    `)
}