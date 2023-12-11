const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let orig = [];
let gals = [];
let exX = [];
let exY = [];
let fact = 999999;

eachLine(filename, function(line) {
  orig.push(line.split(''));
}).then(function(err) {
  for(let y=0;y<orig.length;y++) {
    let exp = true;
    for(let x=0;x<orig[y].length;x++) {
      if(orig[y][x]==='#') {
        exp = false;
      }
    }
    if(exp) {
      exY.push(y);
    }
  }
  for(let x=0;x<orig[0].length;x++) {
    let exp = true;
    for(let y=0;y<orig.length;y++) {
      if(orig[y][x]==='#') {
        exp = false;
      }
    }
    if(exp) {
      exX.push(x);
    }
  }
  for(let y=0;y<orig.length;y++) {
    for(let x=0;x<orig[y].length;x++) {
      if(orig[y][x]==='#') {
        gals.push([y,x]);
      }
    }
  }
  for(let g=0;g<gals.length;g++) {
    let dist = 0;
    for(let d=g+1;d<gals.length;d++) {
      let minY = Math.min(gals[g][0],gals[d][0]);
      let maxY = Math.max(gals[g][0],gals[d][0]);
      let minX = Math.min(gals[g][1],gals[d][1]);
      let maxX = Math.max(gals[g][1],gals[d][1]);
      let next = (maxY-minY) + (maxX-minX) + (fact*exY.filter((f)=>((f>minY)&&(f<maxY))).length) + (fact*exX.filter((f)=>((f>minX)&&(f<maxX))).length);
      dist += next;
    }
    answer += dist;
  }
  console.log(answer);
});
