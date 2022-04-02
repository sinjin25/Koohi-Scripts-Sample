module.exports = async function setupDb (config) {
    const db = await require('mysql2-promise')()
    const { HOST, USER, PASS, DB} = config
    await db.configure({
        host: HOST,
        user: USER,
        password: PASS,
        database: DB,
    })
    return db
}