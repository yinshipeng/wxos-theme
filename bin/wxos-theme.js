#!/usr/bin/env node

var program = require('commander')
var chalk = require('chalk')
var main = require('../index.js')
var check = require('../lib/gen-vars').check
var config = {}

console.log()
process.on('exit', function () {
    console.log()
})

program
    .version(require('../package.json').version)
    .option('-i --init [filePath]', 'init variables file')
    .option('-w --watch', 'watch variable changes then build')
    .option('-o --out [outPath]', 'output path', function (out) {config.out = out})
    .option('-m --minimize', 'compressed file', function (minimize) {config.minimize = minimize !== false})
    .option('-c --config [filePath]', 'variables file', function (c) {config.config = c})
    .option('-b --browsers <items>', 'set browsers', function (browsers) {config.browsers = browsers.split(',')})
    .option('-g --generate', 'generate the theme')

// add some useful info on help
program.on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`wt <option> --help`)} for detailed usage of given command.`)
    console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// enhance common error messages
const enhanceErrorMessages = (methodName, log) => {
    program.Command.prototype[methodName] = function (...args) {
        if (methodName === 'unknownOption' && this._allowUnknownOption) {
            return
        }
        this.outputHelp()
        console.log(`  ` + chalk.red(log(...args)))
        console.log()
        process.exit(1)
    }
}

enhanceErrorMessages('missingArgument', argName => {
    return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
    return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
    return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
        flag ? `, got ${chalk.yellow(flag)}` : ``
    )
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}

check()

if (program.init) {
    return main.init(program.init)
}

if (program.generate) {
    program.watch ? main.watch(config) : main.run(config)
}


