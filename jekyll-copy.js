"use strict";
/**
 * Jekyll Copy Module
 */
var boxen = require('boxen');
var chalk = require('chalk');
var cp = require('child_process');
var fs = require('fs');
// https://github.com/SBoudrias/Inquirer.js 
var inquirer = require('inquirer');
var path = require('path');
// https://www.npmjs.com/package/commander
var program = require('commander');
https: //stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
 var yaml = require('js-yaml');
var appName = 'Jekyll Template File Copy (jcp)';
var appAuthor = 'by John M. Wargo (https://johwargo.com)';
var blankStr = '';
var configFile = '_config.yml';
var gemFile = 'Gemfile';
var templateFolder;
var templateName;
function fileExists(fileName) {
    var filePath = path.join(process.cwd(), fileName);
    // console.log(`Validating existence of ${filePath}`);
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
function getTemplateName() {
    // console.log('\nProcessing configuration file');
    try {
        var fileContents = fs.readFileSync(configFile, 'utf8');
        var data = yaml.safeLoad(fileContents);
        if (data) {
            return data.theme;
        }
        else {
            return blankStr;
        }
    }
    catch (e) {
        console.log(chalk.red("\nUnable to read config file (" + configFile + ")"));
        return blankStr;
    }
}
/**
* execSync returns a buffer which the code converts to a string
* The string value is a paragraph like this:
*
*   * minima (2.5.1)
*     Summary: A beautiful, minimal theme for Jekyll.
*     Homepage: https://github.com/jekyll/minima
*     Path: D:/Ruby26-x64/lib/ruby/gems/2.6.0/gems/minima-2.5.1
*
* Which the code splits to grab everything from 'Path: ' to the end of the string
*/
function getTemplateFolder(template) {
    var cmd = "bundle info " + template;
    // console.log(`Executing ${cmd}`);
    var res = cp.execSync(cmd);
    var tmpFolder = res.toString().split('Path: ')[1];
    return tmpFolder;
}
// https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
var capitalize = function (s) {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
function validConfig() {
    // looking for two files
    if (fileExists(configFile) && fileExists(gemFile)) {
        // Read the template name from the config file
        // have to leave this in lower case because of the later check for file path
        templateName = getTemplateName();
        if (templateName.length > 0) {
            console.log("Jekyll project uses the '" + capitalize(templateName) + "' template");
            templateFolder = getTemplateFolder(templateName);
            if (templateFolder && templateFolder.length > 0) {
                console.log(capitalize(templateName) + " template folder: " + templateFolder);
                return fs.existsSync(path.dirname(templateFolder));
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
console.log(boxen(appName + "\n" + appAuthor, { padding: 1 }));
console.log();
program.version('0.0.1');
program.command('ls [folder]')
    .description('List Jekyll template folders and files.')
    .action(function (folder) {
    if (folder === void 0) { folder = 'current'; }
    console.log("\nListing files for " + folder + " folder");
});
program.command('cp <file>')
    .description('Copy a Jekyll template file to the current location.')
    .action(function (file) {
    console.log("\nCopying " + file + " to project folder");
});
if (validConfig()) {
    console.log(chalk.green('Configuration is valid'));
    program.parse(process.argv);
}
else {
    console.log(chalk.red('\nInvalid configuration!'));
    console.log('Make sure the terminal is in a Jekyll project folder before executing the command');
}
