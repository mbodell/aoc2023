const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let rules = {};
let parts = [];

const RULES = 0;
const PARTS = 1;

let state = RULES;

const LT = 0;
const GT = 1;
const EL = 2;

const X = 0;
const M = 1;
const A = 2;
const S = 3;

let accepted = [];
let rejected = [];

eachLine(filename, function(line) {
  if(line.length===0&&state===RULES) {
    state = PARTS;
  } else if(state===RULES) {
    parseRules(line);
  } else {
    parseParts(line);
  }
}).then(function(err) {
  parts.map((m)=>processParts(m));
  console.log(parts);
  console.log(rules);
  console.log(accepted);
  console.log(rejected);
  answer = accepted.map((m)=>m.reduce((a,b)=>a+b)).reduce((a,b)=>a+b);
  console.log(answer);
});

function processParts(p) {
  let next = "in";
  console.log(`processing parts ${p} and starting with ${next}`);
  while(next!=="A"&&next!=="R") {
    let rule = rules[next];
    let done = false;
    for(let k=0;!done&&k<rule.length;k++) {
      switch(rule[k][0]) {
        case LT:
          if(p[rule[k][2]]<rule[k][3]) {
            next = rule[k][1];
            done = true;
          }
          break;
        case GT:
          if(p[rule[k][2]]>rule[k][3]) {
            next = rule[k][1];
            done = true;
          }
          break;
        case EL:
          next = rule[k][1];
          done = true;
          break;
      }
    }
  }
  if(next==="A") {
    accepted.push(p);
  } else {
    rejected.push(p);
  }
}

function parseRules(r) {
  let label = r.split('{')[0];
  let list = r.split('{')[1].slice(0,-1).split(',').map((m)=>parseCmp(m));
  rules[label] = list;
}

function parseParts(r) {
  let e = r.slice(1,-1).split(',').map((m)=>parseInt(m.split('=')[1]));
  parts.push(e);
}

function parseCmp(r) {
  let op = EL;
  let next = r;
  let vari = X;
  let num = 0;
  let p=r.split(':');
  if(p.length!==1) {
    op = (p[0][1]==='>')?GT:LT;
    switch(p[0][0]) {
      case 'x': vari = X; break;
      case 'm': vari = M; break;
      case 'a': vari = A; break;
      case 's': vari = S; break;
    }
    next = p[1];
    num = parseInt(p[0].slice(2))
  }
  return [op, next, vari, num];
}

