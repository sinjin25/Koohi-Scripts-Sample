function formatRawData(str, columns, lineDelim = '\r\n', colDelim = '\t') {
    // split by line delim
    const lines = str.split(lineDelim).filter((i) => i)
    // split each line by col
    const formattedLines = lines.map(i => {
        return i.split(colDelim).filter(o => o)
    })
    // translate to object
    return formattedLines.map((row) => {
        const obj = {}
        let pointer = 0
        row.forEach((o) => {
            obj[columns[pointer]] = o
            pointer++
        })
        return obj
    })
}

module.exports = formatRawData