module.exports = function(dest, filename, response) {
    const fse = require('fs-extra')
    const path = require('path')
    return fse.ensureDir(
        path.join(dest, 'add-book-response')
    )
    .then(() => {
        return fse.writeFile(
            path.join(dest, 'add-book-response', `response__${filename}`),
            JSON.stringify(response, null, 4)
        )
        .then(() => {
            try {
                const insertId = response.slice(-1)[0].items.insertId
                return insertId
            } catch(e) {
                return null
            }
        })
    })
    .catch((err) => {
        console.warn('Error in logResponse')
        console.warn(err)
    })
}