// remove up to /ref part of url

module.exports = function(url) {
    // fragile solution
    const m = url.split(/\/ref/)[0]
    if (m === null) {
        console.log('Possibly invalid url format for ', url)
        return false
    }
    return m
}