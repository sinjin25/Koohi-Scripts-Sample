const readReadabilityDump = require('./03a-readability/read-readability-dump')
const formatRawData = require('./03a-readability/format-raw-data')
const logReadability = require('./03a-readability/log-readability')

const LINE_DELIMITER = '\r\n'
const COLUMN_DELIMTIER = '\t'
const COLUMNS = ['???', 'score', 'filename']

const files = readReadabilityDump()
.then((data) => {
    return data.map((i) => {
        return formatRawData(i.value, COLUMNS, LINE_DELIMITER, COLUMN_DELIMTIER)
    })
})
.then((data) => {
    data.flat(99).forEach((i) => {
        logReadability(i)
    })
})