/**
 * Jekyll Copy Module
 */

const boxen = require('boxen');
var chalk = require('chalk');
const fs = require('fs');
// https://github.com/SBoudrias/Inquirer.js 
const inquirer = require('inquirer');
// https://www.npmjs.com/package/commander
const program = require('commander');
https://stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
const yaml = require('js-yaml')

const appName = 'Jekyll Template File Copy';
const appAuthor = 'by John M. Wargo (johwargo.com)';

function getTemplateFolder() {
  console.log(chalk.yellow('\nValidating template folder'));

}

program
  .version('0.0.1')
  .command('ls [folder]')
  .description('List Jekyll template folders and files.')
  .action((folder: string = 'current') => {
    console.log(`Listing files for ${folder} folder`);

  });

program
  .command('--cp <file>')
  .description('Copy a Jekyll template file to the current location.')
  .action((file: string) => {
    console.log('executing cp');
  });

console.log();
console.log(boxen(`${appName}\n\n${appAuthor}`, { padding: 1 }));

// console.log(program.list);
// console.dir(program.commands);