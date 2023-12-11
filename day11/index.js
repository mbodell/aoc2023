const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let orig = [];
let expand = [];
let gals = [];
let exX = [];
let exY = [];

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
    let row = [];
    for(let x=0;x<orig[y].length;x++) {
      row.push(orig[y][x]);
      if(exX.includes(x)) {
        row.push(orig[y][x]);
      }
    }
    expand.push(row);
    if(exY.includes(y)) {
      expand.push(row);
    }
  }
  for(let y=0;y<expand.length;y++) {
    for(let x=0;x<expand[y].length;x++) {
      if(expand[y][x]==='#') {
        gals.push([y,x]);
      }
    }
  }
  for(let g=0;g<gals.length;g++) {
    let dist = 0;
    for(let d=g+1;d<gals.length;d++) {
      dist += Math.abs(gals[g][0]-gals[d][0]) + Math.abs(gals[g][1]-gals[d][1]);
    }
    answer += dist;
  }
  console.log(answer);
});
