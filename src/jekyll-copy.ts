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
const blankStr = '';
const configFile = '_config.yml';
const gemFile = 'Gemfile';

function fileExists(fileName: string): boolean {
  try {
    return fs.existsSync(fileName);
  } catch (err) {
    console.error(err);
    return false;
  }
}

function validConfig(): boolean {
  // looking for two files
  if (fileExists(configFile) && fileExists(gemFile)) {
    // Read the template name from the config file

  } else {
    return false;
  }
  return false;
}

function getTemplateName(): string {
  try {
    let fileContents = fs.readFileSync(configFile, 'utf8');
    let data = yaml.safeLoad(fileContents);
    if (data) {
      console.log(data);
      return data.theme;
    } else {
      return blankStr;
    }
  } catch (e) {
    console.error(`Unable to read config file (${configFile})`);
    return blankStr;
  }
}

function getTemplateFolder() {
  console.log(chalk.yellow('\nValidating template folder'));

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
