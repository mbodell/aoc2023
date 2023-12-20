const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let commands = [];

eachLine(filename, function(line) {
  commands = line.split(',');
}).then(function(err) {
  answer = commands.map((c)=>hashStr(c)).reduce((a,b)=>a+b);
  console.log(answer);
});

function hashStr(str) {
  let ret = 0;
  for(let k=0;k<str.length;k++) {
    ret += str.charCodeAt(k);
    ret *= 17;
    ret = ret % 256;
  }
  return ret;
}
