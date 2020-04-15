/**
 * Jekyll Copy Module
 */

const boxen = require('boxen');
var chalk = require('chalk');
const fs = require('fs');
// https://github.com/SBoudrias/Inquirer.js 
const inquirer = require('inquirer');
const path = require('path');
// https://www.npmjs.com/package/commander
const program = require('commander');
https://stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
const yaml = require('js-yaml')

const appName = 'Jekyll Template File Copy';
const appAuthor = 'by John M. Wargo (johwargo.com)';
const blankStr = '';
const configFile = '_config.yml';
const gemFile = 'Gemfile';

var templateFolder: string;
var templateName: string;

function execShellCommand(cmd: string) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

function fileExists(fileName: string): boolean {
  let filePath = path.join(process.cwd(), fileName);
  // console.log(`Validating existence of ${filePath}`);
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(err);
    return false;
  }
}

function validConfig(): boolean {
  // console.log('Validating configuration');
  // looking for two files
  if (fileExists(configFile) && fileExists(gemFile)) {
    // Read the template name from the config file
    templateName = getTemplateName();
    console.log(`Jekyll template: ${templateName}`);
    if (templateName.length > 0) {
      templateFolder = getTemplateFolder(templateName);
    } else {
      return false;
    }
  } else {
    return false;
  }
  return false;
}

function getTemplateName(): string {
  console.log('Processing configuration file');
  try {
    let fileContents = fs.readFileSync(configFile, 'utf8');
    let data = yaml.safeLoad(fileContents);
    if (data) {
      return data.theme;
    } else {
      return blankStr;
    }
  } catch (e) {
    console.log(chalk.red(`\nUnable to read config file (${configFile})`));
    return blankStr;
  }
}

//TODO: here!
getTemplateFolder = async (template: string) {
  console.log(chalk.yellow('\nValidating template folder'));  
  var result: any = await execShellCommand(`bundle show ${template}`);
  console.log(result);
  return result.toString();
}

console.log();
console.log(boxen(`${appName}\n\n${appAuthor}`, { padding: 1 }));

program.version('0.0.1');

program.command('ls [folder]')
  .description('List Jekyll template folders and files.')
  .action((folder: string = 'current') => {
    console.log(`Listing files for ${folder} folder`);

  });

program.command('cp <file>')
  .description('Copy a Jekyll template file to the current location.')
  .action((file: string) => {
    console.log('executing cp');
  });

if (validConfig()) {
  program.parse(process.argv);
} else {
  console.log(chalk.red('\nInvalid configuration!'));
  console.log('Make sure the terminal is in a Jekyll project folder before executing the command');
}
