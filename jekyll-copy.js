/**
 * Jekyll Copy Module
 */

const fs = require('fs');
// https://github.com/SBoudrias/Inquirer.js 
const inquirer = require('inquirer');
// https://www.npmjs.com/package/commander
const program = require('commander');

program
  .version('0.0.1')
  .command('ls <folder>', 'list the Jekyll template folders/files')
  .description('')
  .command('--cp [copy]', 'Copy a Jekyll template file to the current location')
  .parse(process.argv)

console.log(program.list);