/**
 * Jekyll Copy Module
 */

const boxen = require('boxen');
const chalk = require('chalk');
const cp = require('child_process');
const fs = require('fs');
// https://github.com/SBoudrias/Inquirer.js 
const inquirer = require('inquirer');
const path = require('path');
// https://www.npmjs.com/package/commander
const program = require('commander');
https://stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
const yaml = require('js-yaml')

const appName = 'Jekyll Template File Copy (jcp)';
const appAuthor = 'by John M. Wargo (https://johwargo.com)';
const blankStr = '';
const configFile = '_config.yml';
const gemFile = 'Gemfile';

var templateFolder: string;
var templateName: string;
var debugMode = false;

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

function getTemplateName(): string {
  // console.log('Processing configuration file');
  try {
    let fileContents = fs.readFileSync(configFile, 'utf8');
    let data = yaml.safeLoad(fileContents);
    if (data) {
      return data.theme;
    } else {
      return blankStr;
    }
  } catch (e) {
    console.log(chalk.red(`Unable to read config file (${configFile})`));
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
  var cmd = `bundle info ${template}`;
  var res = cp.execSync(cmd);
  var tmpFolder = res.toString().split('Path: ')[1];
  return tmpFolder;
}

const capitalize = (s: string) => {
  // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function validConfig(): boolean {
  console.log('Validating Jekyll configuration');
  // looking for two files
  if (fileExists(configFile) && fileExists(gemFile)) {
    // Read the template name from the config file
    // have to leave this in lower case because of the later check for file path
    templateName = getTemplateName();
    // do we have a template name?
    if (templateName && templateName.length > 0) {
      console.log(`Jekyll project uses the '${capitalize(templateName)}' template`);
      templateFolder = getTemplateFolder(templateName);
      // Do we have a template folder?
      if (templateFolder && templateFolder.length > 0) {
        console.log(`${capitalize(templateName)} template folder: ${templateFolder}`);
        // does the template folder exist?
        var theFolder = fs.existsSync(path.dirname(templateFolder));
        if (theFolder) {
          return true;
        } else {
          console.log(chalk.red('Template folder does not exist'));
        }
      } else {
        console.log(chalk.red('Unable to locate template folder'));
      }
    } else {
      console.log(chalk.red('Unable to determine template name'));
    }
  } else {
    console.log(chalk.red('Missing configuration files'));
    console.log('Make sure you execute this module in a Jekyll project folder before executing the command');
  }
  return false;
}

function copyFile(source: string, dest: string) {
  var destFolder = path.dirname(dest);
  console.log(`Copying ${source} to project folder`);
  // does the source file exist?
  if (fs.existsSync(source)) {
    // Does the target folder exist?      
    if (!fs.existsSync(dest)) {
      // create the folder
      try {
        console.log(`Creating destination folder (${dest})`);
        fs.mkdirSync(destFolder);
      } catch (err) {
        console.error(`Unable to create destination folder (${err})`);
        return false;
      }

    }

    // does the destination file exists?
    if (fs.existsSync(dest)) {
      // Ask the user to overwrite

    } else {
      // copy the file
      try {
        fs.copyFileSync(source, dest);
      } catch (err) {
        console.error(`Unable to copy file (${err})`);
        return false;
      }
    }
  } else {
    console.log(chalk.red(`Unable to copy, ${source} does not exist`));
    return false;
  }
}

console.log(boxen(`${appName}\n\n${appAuthor}`, { padding: 1 }));

program.version('0.0.1');

program.option('-d, --debug', 'Output extra information during operation');

program.command('ls [folder]')
  .description('List Jekyll template folders and files')
  .action((folder: string = 'current') => {
    // https://flaviocopes.com/how-to-get-files-names/
    console.log(`Listing files for ${folder} folder`);

    // const dir = '/Users/flavio/folder'
    // const files = fs.readdirSync(dir)

    // for (file of files) {
    //   console.log(file)
    // }

    // Once you have a file reference, you can get its details using

    // const path = require('path')

    // //...

    // //inside the `for` loop
    // const stat = fs.lstatSync(path.join(dir, file))

  });

program.command('cp <filePath>')
  .description('Copy a Jekyll template file to the current location')
  .action((filePath: string) => {
    console.log(`Copying Jekyll file from ${filePath}`);
    // copyFile(path.join(templateFolder, filePath), path.join(__dirname, filePath));
  });

program.command('all')
  .description('Copy all of the Jekyll template files to the current folder')
  .action(() => {
    console.log('Copying all template files');

  });

program.command('compare')
  .description('Compare project folder contents with the template folder')
  .action(() => {

  });


if (validConfig()) {
  // TODO: Figure out why there's an extra carriage return here
  console.log(chalk.green('Configuration is valid'));
  program.parse(process.argv);
  if (program.debug) {
    console.log(chalk.yellow(JSON.stringify(program.opts())));
    debugMode = program.debug;
  }

}
