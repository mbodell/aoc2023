const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let commands = [];
let labels = [];
let inst = [];
let hashes = [];
let boxes = [];
let focus = [];

eachLine(filename, function(line) {
  commands = line.split(',');
}).then(function(err) {
  labels = commands.map((c)=>(/=/.test(c)?c.split('=')[0]:c.split('-')[0]));
  hashes = labels.map((c)=>hashStr(c));
  inst = commands.map((c)=>(/=/.test(c)?1:0));
  focus = commands.map((c)=>(/=/.test(c)?parseInt(c.split('=')[1]):0));
  for(let k=0;k<256;k++) {
    boxes[k] = [];
  }
  for(let k=0;k<commands.length;k++) {
    switch(inst[k]) {
      case 1:
        let pres = false;
        for(let i=0;!pres && i<boxes[hashes[k]].length;i++) {
          if(labels[k]===boxes[hashes[k]][i][0]) {
            boxes[hashes[k]][i][1] = focus[k];
            pres = true;
          }
        }
        if(!pres) {
          boxes[hashes[k]].push([labels[k], focus[k]]);
        }
        break;
      case 0:
        for(let i=0;i<boxes[hashes[k]].length;i++) {
          if(labels[k]===boxes[hashes[k]][i][0]) {
            boxes[hashes[k]].splice(i,1);
          }
        }
    }
  }
  for(let k=0;k<255;k++) {
    for(let d=0;d<boxes[k].length;d++) {
      answer += (k+1)*(d+1)*boxes[k][d][1];
    }
  }
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
