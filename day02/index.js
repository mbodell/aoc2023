const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let maxR = 12;
let maxG = 13;
let maxB = 14;

eachLine(filename, function(line) {
  let p = line.split(":").map((s)=>s.trim());
  let g = p[1].split(";").map((s)=>s.trim());
  let valid = true;
  let game = parseInt(p[0].split(" ")[1]);
  for(let i=0;i<g.length;i++) {
    let m = g[i].split(", ");
    for(let j=0;j<m.length;j++) {
      let n = m[j].split(" ");
      if(n[1] === 'red') {
        if(parseInt(n[0]) > maxR) {
          valid = false;
        }
      } else if(n[1] === 'blue') {
        if(parseInt(n[0]) > maxB) {
          valid = false;
        }
      } else if(n[1] === 'green') {
        if(parseInt(n[0]) > maxG) {
          valid = false;
        }
      }
    }
  }
  if(valid) {
    answer += game;
  }
}).then(function(err) {
  console.log(answer);
});
