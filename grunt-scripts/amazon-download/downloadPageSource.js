const fse = require('fs-extra')

module.exports = function(driver, product, dest) {
    const filename = `${product || url.replace(/\\/g, '-')}.html`
    return driver.getPageSource()
    .then(src => {
        return fse.writeFile(`${dest}/${filename}`, src)
    })
}