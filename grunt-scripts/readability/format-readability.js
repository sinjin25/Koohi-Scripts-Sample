module.exports = function(data, columns, providedOpts) {
    const DEFAULT_OPTS = {
        lineDelim: '\r\n',
        colDelim: '\t',
    }
    const opts = {
        ...DEFAULT_OPTS,
        ...providedOpts
    }

    const lines = data.split(opts.lineDelim)
                .filter((i) => (i))
    const formattedLines = lines.map((aLine) => {
        return aLine.split(opts.colDelim)
                .filter(o => o)
    })
    // translate to object
    return formattedLines.map((aRow) => {
        const obj = {}
        let pointer = 0
        aRow.forEach((aCol) => {
            obj[columns[pointer]] = aCol
            pointer++
        })
        return obj
    })
}