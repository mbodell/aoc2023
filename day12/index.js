const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let rec = [];
let tar = [];

function countChoices(str, num) {
  // test if matches
  let i = 0;
  let curMat = 0;
  let inMat = false;
  let posMat = true;
  let quest = false;
  for(let k=0;posMat && !quest && k<str.length;k++) {
    switch(str[k]) {
      case '?':
        quest = true;
        break;
      case '#':
        inMat = true;
        curMat++;
        if(i===num.length) {
          posMat = false;
        }
        break;
      case '.':
        if(inMat) {
          if(curMat!==num[i]) {
            posMat = false;
          } else {
            i++;
            inMat = false;
            curMat = 0;
          }
        }
        break;
    }
  }
  if(posMat===false) {
    return 0;
  }
  if(/\?/.test(str)) {
    let n1 = countChoices(str.replace("\?","#"),num);
    let n2 = countChoices(str.replace("\?","."),num);
    return n1+n2;
  } else {
    let match = true;
    let idx = 0;
    let count = 1;
    for(let k=0; match && k<str.length; k++) {
      if(str[k]==='#') {
        count = 0;
        for(;match && k<=str.length && count >= 0;k++) {
          if(k===str.length||str[k]!=='#') {
            if(num[idx]!==count) {
              match = false;
            } else {
              idx++;
              count = -1;
              k--;
            }
          } else {
            count++;
          }
        }
      }
    }
    if(match) {
      if(idx<num.length) {
        if(num[idx]!== count) {
          match = false;
        } else {
          idx++;
        }
      }
      if(idx!==num.length) {
        match = false;
      }
      if(match) {
        return 1;
      }
    }
    return 0;
  }
}
eachLine(filename, function(line) {
  let l=line.split(" ");
  rec.push(l[0]);
  tar.push(l[1].split(",").map((n)=>parseInt(n)));
}).then(function(err) {
  for(let k=0;k<rec.length;k++) {
    let a = countChoices(rec[k],tar[k]);
    answer += a;
  }
  console.log(answer);
});
