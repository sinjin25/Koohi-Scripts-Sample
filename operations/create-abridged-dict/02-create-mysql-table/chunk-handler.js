// handle chunks from the output.csv read stream

module.exports = function(chunk) {
    return chunk.split('\n')
    .map(i =>  {
        return i
        .split('\t')
        .filter((o, index) => index !== 0)
    })
}