#!/usr/bin/env node
"use strict";
/**
 * Jekyll Copy Module
 */
var boxen = require('boxen');
var chalk = require('chalk');
var logger = require('cli-logger');
var cp = require('child_process');
var fs = require('fs');
var path = require('path');
// https://stackoverflow.com/questions/9153571/is-there-a-way-to-get-version-from-package-json-in-nodejs-code
var packageDotJSON = require('./package.json');
// https://www.npmjs.com/package/commander
var program = require('commander');
https: //stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
 var yaml = require('js-yaml');
var appName = 'Jekyll File Copy (jcp)';
var blankStr = '';
var configFile = '_config.yml';
var gemFile = 'Gemfile';
var templateFolder;
var templateName;
var log = logger();
var capitalize = function (s) {
    // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
function setupLogger() {
    var conf = program.debug ? log.DEBUG : log.INFO;
    log.level(conf);
    log.debug(program.opts());
}
function isValidConfig() {
    log.info('Validating Jekyll configuration');
    // looking for two files
    if (targetFileExists(configFile) && targetFileExists(gemFile)) {
        // Read the template name from the config file
        // have to leave this in lower case because of the later check for file path
        templateName = getTemplateName();
        // do we have a template name?
        if (templateName && templateName.length > 0) {
            log.info('Jekyll project uses the ' + chalk.yellow(capitalize(templateName)) + ' template');
            templateFolder = getTemplateFolder(templateName);
            // Do we have a template folder?
            if (templateFolder && templateFolder.length > 0) {
                log.info(chalk.yellow(capitalize(templateName) + " template folder: ") + templateFolder);
                // does the template folder exist?
                var theFolder = fs.existsSync(path.dirname(templateFolder));
                if (theFolder) {
                    return true;
                }
                else {
                    log.error(chalk.red('Template folder does not exist'));
                }
            }
            else {
                log.error(chalk.red('Unable to locate template folder'));
            }
        }
        else {
            log.error(chalk.red('Unable to determine template name'));
        }
    }
    else {
        log.error(chalk.red('Missing configuration files'));
        log.info('Make sure you execute this module in a Jekyll project folder before executing the command');
    }
    return false;
}
function isDirectory(filePath) {
    log.debug("jcp: isDirectory(" + filePath + ")");
    try {
        var stat = fs.lstatSync(filePath);
        return stat.isDirectory();
    }
    catch (err) {
        console.log(chalk.yellow("Unable to determine status of " + filePath + "(" + err + ")"));
        return false;
    }
}
function targetFileExists(fileName) {
    log.debug("jcp: targetFileExists(" + fileName + ")");
    var filePath = path.join(process.cwd(), fileName);
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
function fileExists(filePath) {
    log.debug("jcp: fileExists(" + filePath + ")");
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
function getTemplateName() {
    log.debug('jcp: getTemplateName()');
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
        console.log(chalk.red("Unable to read config file(" + configFile + ")"));
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
    log.debug("jcp: getTemplateFolder(" + template + ")");
    var cmd = "bundle info " + template;
    var res = cp.execSync(cmd);
    // Template folder (today anyway) is the end of the string, after the 'Path: '
    var tmpFolder = res.toString().split('Path: ')[1];
    // Pull any extra junk off the end of the string
    return tmpFolder.trim();
}
function getEntryType(filePath) {
    log.debug("jcp: getEntryType(" + filePath + ")");
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
        console.log(chalk.yellow("Unable to determine status of " + filePath + "(" + err + ")"));
        return unknownString;
    }
}
function getFolderContents(folder, foldersOnly) {
    if (foldersOnly === void 0) { foldersOnly = false; }
    log.debug("jcp: getFolderContents(" + folder + ", " + foldersOnly + ")");
    var contents = [];
    try {
        var files = fs.readdirSync(folder);
        if (files) {
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                try {
                    var filePath = path.join(folder, file);
                    log.debug("File path: " + filePath);
                    var stat = fs.lstatSync(filePath);
                    if (foldersOnly) {
                        if (stat.isDirectory()) {
                            log.debug("Adding " + file + " to the folder list");
                            contents.push(file);
                        }
                    }
                    else {
                        log.debug("Adding " + file + " to the file list");
                        contents.push(getEntryType(filePath) + file);
                    }
                }
                catch (err) {
                    log.error("Unable to get details for \"" + file + "\"(" + err + ")");
                    return [];
                }
            }
            return contents;
        }
    }
    catch (err) {
        log.error("Unable to get directory listing(" + err + ")");
    }
    return [];
}
function copyFile(sourceFile, dest) {
    log.debug("jcp: copyFile(" + sourceFile + ", " + dest + ")");
    var destFolder = path.dirname(dest);
    log.info(chalk.yellow('Source: ') + sourceFile);
    log.info(chalk.yellow('Destination: ') + destFolder);
    // does the source file exist?
    if (fs.existsSync(sourceFile)) {
        log.debug('Source file exists');
        // Does the target folder exist?      
        if (!fs.existsSync(destFolder)) {
            // create the folder
            try {
                log.info("Creating destination folder: " + destFolder);
                fs.mkdirSync(destFolder);
            }
            catch (err) {
                log.error("Unable to create destination folder (" + err + ")");
                return;
            }
        }
        log.debug('Target folder exists');
        // does the destination file exists?
        if (fs.existsSync(dest)) {
            log.info(chalk.red('Copy aborted: ') + 'File already exists at destination');
            return;
        }
        else {
            // copy the file
            log.info("Copying " + path.basename(dest));
            try {
                fs.copyFileSync(sourceFile, dest);
                log.info(chalk.green('File successfully copied'));
            }
            catch (err) {
                log.error("Unable to copy file(" + err + ")");
                return;
            }
        }
    }
    else {
        log.log(chalk.red("Unable to copy, " + sourceFile + " does not exist"));
        return;
    }
}
// Opening window
console.log(boxen(appName, { padding: 1 }));
// Get the version number from the package.json file
program.version(packageDotJSON.version);
// Debug Mode, controls output through logger
program.option('-d, --debug', 'Output extra information during operation');
// program.option('-f, --force', 'Force file overwrite');
program.command('ls [folder]')
    .description('List Jekyll template folders and files')
    .action(function (folder) {
    setupLogger();
    log.info(chalk.yellow('Command: ') + 'List Folder Contents');
    var target = folder ? path.join(templateFolder, folder) : templateFolder;
    log.debug("Target: " + target + " ");
    if (fileExists(target)) {
        if (isDirectory(target)) {
            log.info("Listing contents of " + target + ": \n");
            var contents = getFolderContents(target);
            if (contents) {
                for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
                    var entry = contents_1[_i];
                    console.log(entry);
                }
            }
            else {
                log.info(chalk.yellow("Unable to read contents of " + target + " "));
            }
        }
        else {
            log.error(chalk.red('Target is not a directory'));
        }
    }
    else {
        log.error(chalk.red('Target does not exist'));
    }
});
program.command('cp <filePath>')
    .description('Copy a Jekyll template file to the current location')
    .action(function (filePath) {
    setupLogger();
    log.info(chalk.yellow('Command: ') + 'Copy File');
    var source = path.join(templateFolder, filePath);
    log.debug("Source: " + source + " ");
    var dest = path.join(process.cwd(), filePath);
    log.debug("Destination: " + dest + " ");
    if (fileExists(source)) {
        copyFile(source, dest);
    }
    else {
        log.error(chalk.red('Source file does not exist'));
    }
});
// program.command('all')
//   .description('Copy all of the Jekyll template files to the current folder')
//   .action(() => {
//     setupLogger();
//     log.info(chalk.yellow('Command: ') + 'Copy all template Files');
// 
//   });
if (isValidConfig()) {
    log.debug(chalk.green('Configuration is valid\n'));
    program.parse(process.argv);
}
