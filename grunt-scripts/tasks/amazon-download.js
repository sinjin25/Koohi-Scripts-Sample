const openFirefox = require('../amazon-download/startSelenium')
const cleanUrl = require('../util/cleanUrl')
const openPage = require('../amazon-download/openPage')
/**
 * @param {IGrunt} grunt
 */
module.exports = function(grunt) {
    grunt.registerTask('amazon-download-func', function() {
        grunt.log.writeln('Using 11111')
        const done = this.async()
        const url = grunt.config.get('amazon-download.url')
        if (!url) grunt.warn('Missing a url. Use the url flag ex: grunt amazon-download --src=123')
        grunt.log.writeln('Using url', url)
        return openFirefox()
        .then((driver) => {
            return openPage(driver, cleanUrl(url))
            .then(() => {
                return require('../amazon-download/findProduct')(driver)
            })
            .then((productTitle) => {
                const addToLog = require('../amazon-download/addToLog')
                const downloadPageSource= require('../amazon-download/downloadPageSource')
                return Promise.all([
                    addToLog(
                        cleanUrl(url), 
                        `${productTitle || url.replace(/\\/g, '-')}.html`,
                        grunt.config.get('dest')
                    ), downloadPageSource(
                        driver,
                        productTitle,
                        grunt.config.get('src')
                    )
                ])
                .catch((err) => {
                    driver.quit()
                    grunt.warn(err)
                    return Promise.reject(err)
                })
            })
            .then(() => {
                return driver.quit()
            })
            .then(done)
        })
    })
}