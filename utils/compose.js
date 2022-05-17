/* module.exports = (...fns) => startVal => fns.reduce((acc, fn) => fn(acc), startVal) */
require('colors')

module.exports = (...fns) => (startVal, debug = false) => {
    return fns.reduce((prev, fn, index) => {
        return prev
        .then((val) => {
            if (debug) console.log('rec', index, typeof fn, 'val', typeof val)
            try {
                return fn(val)
            } catch(e) {
                console.log(e)
                return Promise.reject(e)
            }
        })
        .catch((err) => {
            console.log('compose failed'.red, err)
            console.log('err on'.blue, index, fn)
        })
    }, Promise.resolve(startVal))
}