const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let time = [];
let distance = [];

eachLine(filename, function(line) {
  if(time.length===0) {
    time = line.split(":")[1].trim().split(" ").filter((f)=>/\d+/.test(f)).map((m)=>parseInt(m));
  } else {
    distance = line.split(":")[1].trim().split(" ").filter((f)=>/\d+/.test(f)).map((m)=>parseInt(m));
  }
}).then(function(err) {
  let wins = [];
  for(let i=0;i<time.length;i++) {
    let win = 0;
    for(let k=0;k<time[i];k++) {
      if(k*(time[i]-k)>distance[i]) {
        win++;
      }
    }
    wins.push(win);
  }
  answer = wins.reduce((a,b)=>a*b);
  console.log(answer);
});
