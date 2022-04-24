/**
 * @param {ThenableWebDriver} driver
 */
module.exports = async function(driver, url) {
    await driver.get(url)
    driver.manage().setTimeouts({implicit: 7}) // this is not a good strategy but works

    return driver
}