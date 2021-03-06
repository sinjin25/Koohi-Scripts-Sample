const arrayToPreparedStatement = require('../../util/array-to-prepared-statement')
const fse = require('fs-extra')

const setupValues = (i, arr) => {
    arr.push(
        ...i.map((i) => {
            if (typeof i === 'number') return i
            if (typeof i === 'string') {
                const asInt = parseInt(i, 10)
                if (asInt == i) return asInt
                return i
            }
        })
    )
}

module.exports = async function(db, rows) {
    if (rows.length < 1) return Promise.resolve()
    const prepValues = []
    const valueRows = rows.map((i) => {
        setupValues(i, prepValues)
        const temp = arrayToPreparedStatement(i)
        return `(${temp.join(', ')})`
    })

    const sql = `INSERT INTO data_search_dict (dictId, dictNum, definition) VALUES ${valueRows.join(', ')}`
    return db.execute(sql, prepValues)
    .catch((err) => {
        const data = `${JSON.stringify(err)}
        ${sql}
        ${prepValues.join('\n')}
        `
        fse.writeFile('insert-data-err-log.txt', data)
        return Promise.reject(err)
    })
}