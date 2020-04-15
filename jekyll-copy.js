"use strict";
/**
 * Jekyll Copy Module
 */
var boxen = require('boxen');
var chalk = require('chalk');
var fs = require('fs');
// https://github.com/SBoudrias/Inquirer.js 
var inquirer = require('inquirer');
// https://www.npmjs.com/package/commander
var program = require('commander');
https: //stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
 var yaml = require('js-yaml');
var appName = 'Jekyll Template File Copy';
var appAuthor = 'by John M. Wargo (johwargo.com)';
function getTemplateFolder() {
    console.log(chalk.yellow('\nValidating template folder'));
}
program
    .version('0.0.1')
    .command('ls [folder]')
    .description('List Jekyll template folders and files.')
    .action(function (folder) {
    if (folder === void 0) { folder = 'current'; }
    console.log("Listing files for " + folder + " folder");
});
program
    .command('--cp <file>')
    .description('Copy a Jekyll template file to the current location.')
    .action(function (file) {
    console.log('executing cp');
});
console.log();
console.log(boxen(appName + "\n\n" + appAuthor, { padding: 1 }));
console.log(program.list);
console.dir(program.commands);
