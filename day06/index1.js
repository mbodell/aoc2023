const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let time = [];
let distance = [];

eachLine(filename, function(line) {
  if(time.length===0) {
    time = line.split(":")[1].trim().split(" ").filter((f)=>/\d+/.test(f)).reduce((a,b)=>a+b);
    time = parseInt(time);
  } else {
    distance = line.split(":")[1].trim().split(" ").filter((f)=>/\d+/.test(f)).reduce((a,b)=>a+b);
    distance = parseInt(distance);
  }
}).then(function(err) {
  for(let k=0;k<time;k++) {
    if(k*(time-k)>distance) {
      answer++;
    }
  }
  console.log(answer);
});
