module.exports = function(path) {
    const { Builder } = require('selenium-webdriver')
    const firefox = require('selenium-webdriver/firefox')

    let options = new firefox.Options()
    const service = new firefox.ServiceBuilder(path)

    return new Builder()
    .forBrowser('firefox')
    .setFirefoxService(service)
    .setFirefoxOptions(options)
    .build();
}