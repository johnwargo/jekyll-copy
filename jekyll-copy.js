// https://www.smashingmagazine.com/2017/03/interactive-command-line-application-node-js/?utm_source=javascriptweekly&utm_medium=email

var program = require('commander');

program
  .version('0.0.1')
  .option('-l, --list [list]', 'list of customers in CSV file')
  .parse(process.argv)

console.log(program.list);