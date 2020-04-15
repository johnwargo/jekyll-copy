"use strict";
/**
 * Jekyll Copy Module
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var boxen = require('boxen');
var chalk = require('chalk');
var fs = require('fs');
// https://github.com/SBoudrias/Inquirer.js 
var inquirer = require('inquirer');
var path = require('path');
// https://www.npmjs.com/package/commander
var program = require('commander');
https: //stackabuse.com/reading-and-writing-yaml-to-a-file-in-node-js-javascript/
 var yaml = require('js-yaml');
var appName = 'Jekyll Template File Copy';
var appAuthor = 'by John M. Wargo (johwargo.com)';
var blankStr = '';
var configFile = '_config.yml';
var gemFile = 'Gemfile';
var templateFolder;
var templateName;
function execShellCommand(cmd) {
    var exec = require('child_process').exec;
    return new Promise(function (resolve, reject) {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}
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
function validConfig() {
    // console.log('Validating configuration');
    // looking for two files
    if (fileExists(configFile) && fileExists(gemFile)) {
        // Read the template name from the config file
        templateName = getTemplateName();
        console.log("Jekyll template: " + templateName);
        if (templateName.length > 0) {
            templateFolder = getTemplateFolder(templateName);
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
    return false;
}
function getTemplateName() {
    console.log('Processing configuration file');
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
getTemplateFolder = function (template) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(chalk.yellow('\nValidating template folder'));
                return [4 /*yield*/, execShellCommand("bundle show " + template)];
            case 1:
                result = _a.sent();
                console.log(result);
                return [2 /*return*/, result.toString()];
        }
    });
}); };
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
