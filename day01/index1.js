const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let lines = [];

eachLine(filename, function(line) {
  let orig = line;
  for(i=0;i<line.length;i++) {
    if(/^(one|two|three|four|five|six|seven|eight|nine)/.test(line.substring(i))) {
      line = line.substring(0,i) + line.substring(i).replace(/^one/,'1ne');
      line = line.substring(0,i) + line.substring(i).replace(/^two/,'2wo');
      line = line.substring(0,i) + line.substring(i).replace(/^three/,'3hree');
      line = line.substring(0,i) + line.substring(i).replace(/^four/,'4our');
      line = line.substring(0,i) + line.substring(i).replace(/^five/,'5ive');
      line = line.substring(0,i) + line.substring(i).replace(/^six/,'6ix');
      line = line.substring(0,i) + line.substring(i).replace(/^seven/,'7even');
      line = line.substring(0,i) + line.substring(i).replace(/^eight/,'8ight');
      line = line.substring(0,i) + line.substring(i).replace(/^nine/,'9ine');
      i = 0;
    }
  }
  let newL = line;
  let numbers = line.split('').filter((ch) => /\d/.test(ch));
  let num = parseInt(numbers[0])*10+parseInt(numbers.pop());
  lines.push(num);
  //console.log(`Original was ${orig} and newL was ${newL} and num was ${num}`);
}).then(function(err) {
  console.log(lines);
  answer = lines.reduce((a,b)=>a+b);
  console.log(answer);
});
