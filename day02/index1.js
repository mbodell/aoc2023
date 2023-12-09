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
  let game = parseInt(p[0].split(" ")[1]);
  let minR = 0;
  let minG = 0;
  let minB = 0;
  for(let i=0;i<g.length;i++) {
    let m = g[i].split(", ");
    for(let j=0;j<m.length;j++) {
      let n = m[j].split(" ");
      if(n[1] === 'red') {
        if(parseInt(n[0]) > minR) {
          minR = parseInt(n[0]);
        }
      } else if(n[1] === 'blue') {
        if(parseInt(n[0]) > minB) {
          minB = parseInt(n[0]);
        }
      } else if(n[1] === 'green') {
        if(parseInt(n[0]) > minG) {
          minG = parseInt(n[0]);
        }
      }
    }
  }
  let pow = minR*minB*minG;
  answer += pow;
}).then(function(err) {
  console.log(answer);
});
