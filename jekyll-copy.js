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
function validConfig() {
    return false;
}
function getTemplateName() {
    return '';
}
function getTemplateFolder() {
    console.log(chalk.yellow('\nValidating template folder'));
}
console.log();
console.log(boxen(appName + "\n\n" + appAuthor, { padding: 1 }));
program.version('0.0.1');
program.command('ls [folder]')
    .description('List Jekyll template folders and files.')
    .action(function (folder) {
    if (folder === void 0) { folder = 'current'; }
    console.log("Listing files for " + folder + " folder");
});
program.command('cp <file>')
    .description('Copy a Jekyll template file to the current location.')
    .action(function (file) {
    console.log('executing cp');
});
if (validConfig()) {
    program.parse(process.argv);
}
else {
    console.log(chalk.red('\nInvalid configuration!'));
    console.log('Make sure the terminal is in a Jekyll project folder before executing the command');
}
