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
// TODO: implement conditional logging
var debugMode = false;
function isValidConfig() {
    console.log('Validating Jekyll configuration');
    // looking for two files
    if (targetFileExists(configFile) && targetFileExists(gemFile)) {
        // Read the template name from the config file
        // have to leave this in lower case because of the later check for file path
        templateName = getTemplateName();
        // do we have a template name?
        if (templateName && templateName.length > 0) {
            console.log("Jekyll project uses the '" + capitalize(templateName) + "' template");
            templateFolder = getTemplateFolder(templateName);
            // Do we have a template folder?
            if (templateFolder && templateFolder.length > 0) {
                console.log(capitalize(templateName) + " template folder: " + templateFolder);
                // does the template folder exist?
                var theFolder = fs.existsSync(path.dirname(templateFolder));
                if (theFolder) {
                    return true;
                }
                else {
                    console.log(chalk.red('Template folder does not exist'));
                }
            }
            else {
                console.log(chalk.red('Unable to locate template folder'));
            }
        }
        else {
            console.log(chalk.red('Unable to determine template name'));
        }
    }
    else {
        console.log(chalk.red('Missing configuration files'));
        console.log('Make sure you execute this module in a Jekyll project folder before executing the command');
    }
    return false;
}
function isDirectory(filePath) {
    try {
        var stat = fs.lstatSync(filePath);
        return stat.isDirectory();
    }
    catch (err) {
        console.log(chalk.yellow("Unable to determine status of " + filePath + " (" + err + ")"));
        return false;
    }
}
function targetFileExists(fileName) {
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
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
function getTemplateName() {
    // console.log('Processing configuration file');
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
        console.log(chalk.red("Unable to read config file (" + configFile + ")"));
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
    // console.log('Jekyll-Copy: getTemplateFolder');
    var cmd = "bundle info " + template;
    var res = cp.execSync(cmd);
    // Template folder (today anyway) is the end of the string, after the 'Path: '
    var tmpFolder = res.toString().split('Path: ')[1];
    // Pull any extra junk off the end of the string
    return tmpFolder.trim();
}
function getEntryType(filePath) {
    // console.log('Jekyll-Copy: getEntryType');  
    var unknownString = '<unknown>   ';
    try {
        var stat = fs.lstatSync(filePath);
        if (stat.isDirectory())
            return '<directory> ';
        if (stat.isFile())
            return '<file>      ';
        return unknownString;
    }
    catch (err) {
        console.log(chalk.yellow("Unable to determine status of " + filePath + " (" + err + ")"));
        return unknownString;
    }
}
function getFolderContents(folder, foldersOnly) {
    if (foldersOnly === void 0) { foldersOnly = false; }
    // console.log('Jekyll-Copy: getFolderContents');
    var contents = [];
    try {
        var files = fs.readdirSync(folder);
        if (files) {
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                try {
                    var filePath = path.join(folder, file);
                    // console.log(`File path: ${filePath}`);
                    var stat = fs.lstatSync(filePath);
                    if (foldersOnly) {
                        if (stat.isDirectory()) {
                            // console.log(`Adding ${file} to the folder list`);
                            contents.push(file);
                        }
                    }
                    else {
                        // console.log(`Adding ${file} to the file list`);
                        contents.push(getEntryType(filePath) + file);
                    }
                }
                catch (err) {
                    console.error("Unable to get details for \"" + file + "\" (" + err + ")");
                    return [];
                }
            }
            return contents;
        }
    }
    catch (err) {
        console.error("Unable to get directory listing (" + err + ")");
    }
    return [];
}
var capitalize = function (s) {
    // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
function copyFile(source, dest) {
    // console.log('Jekyll-Copy: copyFile()');
    var destFolder = path.dirname(dest);
    console.log("Copying " + source + " to project folder");
    // does the source file exist?
    if (fs.existsSync(source)) {
        // Does the target folder exist?      
        if (!fs.existsSync(dest)) {
            // create the folder
            try {
                console.log("Creating destination folder (" + dest + ")");
                fs.mkdirSync(destFolder);
            }
            catch (err) {
                console.error("Unable to create destination folder (" + err + ")");
                return false;
            }
        }
        // does the destination file exists?
        if (fs.existsSync(dest)) {
            // Ask the user to overwrite
            // TODO: Finish this code
        }
        else {
            // copy the file
            try {
                fs.copyFileSync(source, dest);
            }
            catch (err) {
                console.error("Unable to copy file (" + err + ")");
                return false;
            }
        }
    }
    else {
        console.log(chalk.red("Unable to copy, " + source + " does not exist"));
        return false;
    }
}
console.log(boxen(appName + "\n\n" + appAuthor, { padding: 1 }));
program.version('0.0.1');
program.option('-d, --debug', 'Output extra information during operation');
program.command('ls [folder]')
    .description('List Jekyll template folders and files')
    .action(function (folder) {
    var target = folder ? path.join(templateFolder, folder) : templateFolder;
    if (fileExists(target)) {
        if (isDirectory(target)) {
            console.log("Listing contents of " + target + ":\n");
            var contents = getFolderContents(target);
            if (contents) {
                for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
                    var entry = contents_1[_i];
                    console.log(entry);
                }
            }
            else {
                console.log(chalk.yellow("Unable to read contents of " + target));
            }
        }
        else {
            console.log(chalk.red('Target is not a directory'));
        }
    }
    else {
        console.log(chalk.red('Target does not exist'));
    }
});
program.command('cp <filePath>')
    .description('Copy a Jekyll template file to the current location')
    .action(function (filePath) {
    console.log("Copying Jekyll file from " + filePath);
    // copyFile(path.join(templateFolder, filePath), path.join(__dirname, filePath));
});
// program.command('all')
//   .description('Copy all of the Jekyll template files to the current folder')
//   .action(() => {
//     console.log('Copying all template files');
//   });
// program.command('compare')
//   .description('Compare project folder contents with the template folder')
//   .action(() => {
//   });
if (isValidConfig()) {
    // TODO: Figure out why there's an extra carriage return here
    console.log(chalk.green('Configuration is valid\n'));
    program.parse(process.argv);
    if (program.debug) {
        console.log(chalk.yellow(JSON.stringify(program.opts())));
        debugMode = program.debug;
    }
}
