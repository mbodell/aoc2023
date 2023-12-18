const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let rec = [];
let tar = [];
let memo = [];

function evaluate(str, num, c, idx) {
  let ret = 0;
  if(memo[c][idx] >= 0) {
    return memo[c][idx];
  }
  if(idx===num.length) {
    //console.log(`in idx up to num[idx] with ${idx} and ${num} with ${c}`);
    let valid = true;
    for(let k=c;valid&&k<str.length;k++) {
      if(str[k]==='#') {
        valid = false;
      }
    }
    if(valid) {
      memo[c][idx] = 1;
      return 1;
    } else {
      memo[c][idx] = 0;
      return 0;
    }
  }
  if(c>=str.length) {
    memo[c][idx] = 0;
    return 0;
  }
  switch(str[c]) {
    case '.':
      ret = evaluate(str, num, c+1, idx);
      break;
    case '?':
      ret = evaluate(str, num, c+1, idx);
      //console.log(`for ${c} and ${idx} we need to add ${ret}`);
      // intentional fall through
    case '#':
      let valid = true;
      for(let k=0;k<num[idx]&&(k+c)<str.length;k++) {
        if(str[k+c]==='.') {
          valid = false;
        }
      }
      if(valid&&(str[c+num[idx]]==='?'||str[c+num[idx]]==='.')) {
        ret += evaluate(str, num, c+num[idx]+1, idx+1);
      } else {
        ret += 0;
      }
      break;
  }
  memo[c][idx] = ret;
  //console.log(`First time for ${c} and ${idx} gives ${ret}`);
  return ret;
}

function countChoices(str, num) {
  // test if matches
  for(let k=0;k<=str.length;k++) {
    memo[k] = [];
    for(let j=0;j<=num.length;j++) {
      memo[k][j] = -1;
    }
  }
  return evaluate(str, num, 0, 0);
}
eachLine(filename, function(line) {
  let l=line.split(" ");
  rec.push(l[0]+'?'+l[0]+'?'+l[0]+'?'+l[0]+'?'+l[0]+'...');
  let n = l[1].split(",").map((n)=>parseInt(n));
  tar.push(n.concat(n).concat(n).concat(n).concat(n));
}).then(function(err) {
  for(let k=0;k<rec.length;k++) {
    let a = countChoices(rec[k],tar[k]);
    console.log(`For line ${k} the count is ${a} from ${rec[k]} and ${tar[k]}`);
    answer += a;
  }
  console.log(answer);
});
