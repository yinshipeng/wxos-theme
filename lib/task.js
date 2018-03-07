var path = require('path')
var fs = require('fs')
var gulp = require('gulp')
var ora = require('ora')
var nop = require('gulp-nop')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var cssmin = require('gulp-cssmin')
var config = require('./config')

exports.build = function (opts) {
    var spin = ora(opts.message).start()
    var stream
    var components
    var cssFiles = '*'

    if (config.components) {
        components = config.components.concat(['base'])
        cssFiles = '{' + components.join(',') + '}'
    }
    var varsPath = path.resolve(config.themePath, './lib/common/var.scss')
    fs.writeFileSync(varsPath, fs.readFileSync(path.resolve(process.cwd(), opts.config || config.config)), 'utf-8')

    stream = gulp.src([opts.config || config.config, path.resolve(config.themePath, './lib/' + cssFiles + '.scss')])
        .pipe(sass.sync())
        .pipe(autoprefixer({
            browsers: config.browsers,
            cascade: false
        }))
        .pipe((opts.minimize || config.minimize) ? cssmin({showLog: false}) : nop())
        .pipe(gulp.dest(opts.out || config.out))
        .on('end', function () {
            spin.succeed()
        })

    return stream
}
