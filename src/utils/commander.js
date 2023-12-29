const { Command } = require('commander') 

const program = new Command

program
    .option('--mode <mode>', 'Modo de ejecución de app', 'development')
    .parse()

module.exports = {
    program
}