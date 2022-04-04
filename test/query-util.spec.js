const chai = require('chai')
const expect = chai.expect
const arrayToPreparedStatement = require('../operations/util/array-to-prepared-statement')

describe("Test array-to-prepared-statement.js", () => {
    it('Should be able to convert an object', () => {
        const rows = [
            { dictNum: 11111, definition: "to test something" },
            { dictNum: 123131, definition: "to test something2" },
        ]
        const result = arrayToPreparedStatement(rows[0])
        expect(result).to.eql([`?`, `?`])
    })
    it('Should be able to convert an array', () => {
        const aRow = [11111, "to test something"]
        const aRow2 = [123131, "to test something2"]

        const result = [aRow, aRow2].map((i) => arrayToPreparedStatement(i))
        expect(result.length).to.eql(2)
        expect(result[0]).to.eql([`?`, `?`])
    })
    it('Should play nicely with creating a statement', () => {
        const sql = `INSERT INTO test VALUES (dictNum, definition) VALUES ...`
        const aRow = [11111, "to test something"]
        const aRow2 = [123131, "to test something2"]

        const result = [aRow, aRow2].map(
                            (i) => `(${arrayToPreparedStatement(i).join(', ')})`
                        )
        expect(sql.replace('...', result)).to.eql(
            `INSERT INTO test VALUES (dictNum, definition) VALUES (?, ?),(?, ?)`
        )
    })
})