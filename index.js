var gulp = require('gulp')
var series = require('run-sequence').use(gulp)
var task = require('./lib/task')
var vars = require('./lib/gen-vars')
var config = require('./lib/config')

var build = function (opts) {
    return function () {
        return task.build(Object.assign(opts, {message: 'build element theme'}))
    }
}

exports.init = function (filePath) {
    filePath = {}.toString.call(filePath) === '[object String]' ? filePath : ''
    vars.init(filePath)
}

exports.watch = function (opts) {
    gulp.task('build', build(opts))
    exports.run(opts)
    gulp.watch(opts.config || config.config, ['build'])
}

exports.run = function (opts, cb) {
    gulp.task('build', build(opts))
    if (typeof cb === 'function') {
        return series('build', cb)
    }
    return series('build')
}
