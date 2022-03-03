const extract = (root, rule) => {
    const x = root.querySelector(rule)
    if (x === null) return null
    return x
}

module.exports = extract