require('colors')
const EventEmitter = require('events').EventEmitter
const util = require('util')

class MyQueue {
    tasks = [] // a series of functions, they should take a cb
    concurrency = 3
    running = 0
    completed = 0
    index = 0
    finishable = false
    canFinish() {
        this.finishable = true
    }
    finish() {
        console.log('Job is done', `completed ${this.completed}`.green)
        this.emit('finish')
    }
    next() {
        while( this.running < this.concurrency && this.index < this.tasks.length) {
            if (this.completed % 5000 === 0) console.log('adding a job'.blue, this.tasks.length - this.completed)
            const task = this.tasks[this.index]
            this.index++
            task(() => {
                this.running--
                this.completed++
                if (this.completed === this.tasks.length) {
                    return this.finish()
                }
                this.next()
            })
            this.running++
        }
    }
}
util.inherits(MyQueue, EventEmitter)

module.exports = MyQueue