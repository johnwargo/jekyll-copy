#!/usr/bin/env node
/**
 * Jekyll Copy Module
 */
// TODO: Read version from the package.json file

const boxen = require('boxen');
const chalk = require('chalk');
const logger = require('cli-logger');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
// https://www.npmjs.com/package/commander
const program = require('commander');
https://stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
const yaml = require('js-yaml')

const appName = 'Jekyll Template File Copy (jcp)';
const blankStr = '';
const configFile = '_config.yml';
const gemFile = 'Gemfile';

var templateFolder: string;
var templateName: string;

var log = logger();

const capitalize = (s: string) => {
  // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function setupLogger() {  
  const conf = program.debug ? log.DEBUG : log.INFO;  
  log.level(conf);
  log.debug(program.opts());
}

function isValidConfig(): boolean {
  log.info('Validating Jekyll configuration')
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
        log.info(chalk.yellow(`${capitalize(templateName)} template folder: `) +templateFolder);
        // does the template folder exist?
        var theFolder = fs.existsSync(path.dirname(templateFolder));
        if (theFolder) {
          return true;
        } else {
          log.error(chalk.red('Template folder does not exist'));
        }
      } else {
        log.error(chalk.red('Unable to locate template folder'));
      }
    } else {
      log.error(chalk.red('Unable to determine template name'));
    }
  } else {
    log.error(chalk.red('Missing configuration files'));
    log.info('Make sure you execute this module in a Jekyll project folder before executing the command');
  }
  return false;
}

function isDirectory(filePath: string): boolean {
  log.debug(`jcp: isDirectory(${filePath})`);
  try {
    const stat = fs.lstatSync(filePath);
    return stat.isDirectory();
  } catch (err) {
    console.log(chalk.yellow(`Unable to determine status of ${filePath}(${err})`));
    return false;
  }
}

function targetFileExists(fileName: string): boolean {
  log.debug(`jcp: targetFileExists(${fileName})`);
  let filePath = path.join(process.cwd(), fileName);
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(err);
    return false;
  }
}

function fileExists(filePath: string): boolean {
  log.debug(`jcp: fileExists(${filePath})`);
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(err);
    return false;
  }
}

function getTemplateName(): string {
  log.debug('jcp: getTemplateName()');
  try {
    let fileContents = fs.readFileSync(configFile, 'utf8');
    let data = yaml.safeLoad(fileContents);
    if (data) {
      return data.theme;
    } else {
      return blankStr;
    }
  } catch (e) {
    console.log(chalk.red(`Unable to read config file(${configFile})`));
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
function getTemplateFolder(template: string) {
  log.debug(`jcp: getTemplateFolder(${template})`);
  var cmd = `bundle info ${template}`;
  var res = cp.execSync(cmd);
  // Template folder (today anyway) is the end of the string, after the 'Path: '
  var tmpFolder = res.toString().split('Path: ')[1];
  // Pull any extra junk off the end of the string
  return tmpFolder.trim();
}

function getEntryType(filePath: string): string {
  log.debug(`jcp: getEntryType(${filePath})`);
  const unknownString = '<unknown>   ';
  try {
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) return '<directory> ';
    if (stat.isFile()) return '<file>      '
    return unknownString;
  } catch (err) {
    console.log(chalk.yellow(`Unable to determine status of ${filePath}(${err})`));
    return unknownString;
  }
}

function getFolderContents(folder: string, foldersOnly: boolean = false): string[] {
  log.debug(`jcp: getFolderContents(${folder}, ${foldersOnly})`);
  let contents: string[] = [];
  try {
    const files = fs.readdirSync(folder)
    if (files) {
      for (let file of files) {
        try {
          let filePath = path.join(folder, file);
          log.debug(`File path: ${filePath}`);
          const stat = fs.lstatSync(filePath);
          if (foldersOnly) {
            if (stat.isDirectory()) {
              log.debug(`Adding ${file} to the folder list`);
              contents.push(file);
            }
          } else {
            log.debug(`Adding ${file} to the file list`);
            contents.push(getEntryType(filePath) + file);
          }
        } catch (err) {
          log.error(`Unable to get details for "${file}"(${err})`);
          return [];
        }
      }
      return contents;
    }
  } catch (err) {
    log.error(`Unable to get directory listing(${err})`);
  }
  return [];
}

function copyFile(sourceFile: string, dest: string) {
  log.debug(`jcp: copyFile(${sourceFile}, ${dest})`);
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
        log.info(`Creating destination folder: ${destFolder}`);
        fs.mkdirSync(destFolder);
      } catch (err) {
        log.error(`Unable to create destination folder (${err})`);
        return;
      }
    }
    log.debug('Target folder exists');

    // does the destination file exists?
    if (fs.existsSync(dest)) {
      // TODO: Add option to overwrite existing file, perhaps with command line option
      // log.info('Destination file already exists');
      log.info(chalk.red('Copy aborted: ') + 'File already exists at destination');
      return;
    } else {
      // copy the file
      log.info(`Copying ${path.basename(dest)}`);
      try {
        fs.copyFileSync(sourceFile, dest);
        log.info(chalk.green('File successfully copied'));
      } catch (err) {
        log.error(`Unable to copy file(${err})`);
        return;
      }
    }
  } else {
    log.log(chalk.red(`Unable to copy, ${sourceFile} does not exist`));
    return;
  }
}

// Opening window
console.log(boxen(appName, { padding: 1 }));

program.version('0.0.1');
program.option('-d, --debug', 'Output extra information during operation');
program.command('ls [folder]')
  .description('List Jekyll template folders and files')
  .action((folder: string) => {
    setupLogger();
    log.info(chalk.yellow('Command: ') + 'List Folder Contents');
    let target: string = folder ? path.join(templateFolder, folder) : templateFolder;
    log.debug(`Target: ${target} `);
    if (fileExists(target)) {
      if (isDirectory(target)) {
        log.info(`Listing contents of ${target}: \n`);
        let contents: string[] = getFolderContents(target);
        if (contents) {
          for (let entry of contents) console.log(entry);
        } else {
          log.info(chalk.yellow(`Unable to read contents of ${target} `));
        }
      } else {
        log.error(chalk.red('Target is not a directory'));
      }
    } else {
      log.error(chalk.red('Target does not exist'));
    }
  });
program.command('cp <filePath>')
  .description('Copy a Jekyll template file to the current location')
  .action((filePath: string) => {
    setupLogger();
    log.info(chalk.yellow('Command: ') + 'Copy File');
    let source = path.join(templateFolder, filePath);
    log.debug(`Source: ${source} `);
    let dest = path.join(__dirname, filePath);
    log.debug(`Destination: ${dest} `);
    if (fileExists(source)) {
      copyFile(source, dest);
    } else {
      log.error(chalk.red('Source file does not exist'));
    }
  });

// program.command('all')
//   .description('Copy all of the Jekyll template files to the current folder')
//   .action(() => {
//setupLogger();
//     log.info('Copying all template files');

//   });

// program.command('compare')
//   .description('Compare project folder contents with the template folder')
//   .action(() => {
// setupLogger();
// log.info('comparing files);

//   });

if (isValidConfig()) {
  log.debug(chalk.green('Configuration is valid\n'));
  program.parse(process.argv);
}
