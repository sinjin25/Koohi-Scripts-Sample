/**
 * @param {WebDriverError} driver
 */
module.exports = function(driver) {
    const { By } = require('selenium-webdriver')
    return driver.findElement(By.id('productTitle')).getText()
}