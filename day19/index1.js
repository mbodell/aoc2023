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

let qparts = [];
let qaccepted = [];

eachLine(filename, function(line) {
  if(line.length===0&&state===RULES) {
    state = PARTS;
  } else if(state===RULES) {
    parseRules(line);
  } else {
    parseParts(line);
  }
}).then(function(err) {
  /*
  parts.map((m)=>processParts(m));
  console.log(parts);
  console.log(rules);
  console.log(accepted);
  console.log(rejected);
  answer = accepted.map((m)=>m.reduce((a,b)=>a+b)).reduce((a,b)=>a+b);
  console.log(answer);
  */
  qparts.push(["in", [1, 4000], [1, 4000], [1, 4000], [1, 4000]]);
  while(qparts.length>0) {
    let qp = qparts.pop();
    processQP(qp);
  }
  answer = qaccepted.map((m)=>qCount(m)).reduce((a,b)=>a+b);
  console.log(answer);
});

function processQP(qp) {
  if(qp[0]==="A") {
    qaccepted.push(qp);
  } else if(qp[0]!=="R") {
    let rule = rules[qp[0]];
    let done = false;
    for(let k=0;!done&&k<rule.length;k++) {
      let label = rule[k][1];
      let xmas = rule[k][2];
      let num = rule[k][3];
      switch(rule[k][0]) {
        case LT:
          if(qp[xmas+1][1]<num) {
            // everything matches
            qp[0] = label;
            qparts.push(qp);
            done = true;
          } else if(qp[xmas+1][0]<num) {
            // something matches
            let n = cloneQP(qp);
            n[0] = label;
            n[xmas+1][1]=num-1;
            qparts.push(n);
            qp[xmas+1][0]=num;
          }
          break;
        case GT:
          if(qp[xmas+1][0]>num) {
            // everything matches
            qp[0] = label;
            qparts.push(qp);
            done = true;
          } else if(qp[xmas+1][1]>num) {
            // something matches
            let n = cloneQP(qp);
            n[0] = label;
            n[xmas+1][0]=num+1;
            qparts.push(n);
            qp[xmas+1][1]=num;
          }
          break;
        case EL:
          qp[0] = label;
          qparts.push(qp);
          done = true;
          break;
      }
    }
  }
}
function cloneQP(qp) {
  return [qp[0], [qp[1][0], qp[1][1]], [qp[2][0], qp[2][1]], [qp[3][0], qp[3][1]], [qp[4][0], qp[4][1]]];
}

function qCount(qp) {
  return (qp[1][1]-qp[1][0]+1)*(qp[2][1]-qp[2][0]+1)*(qp[3][1]-qp[3][0]+1)*(qp[4][1]-qp[4][0]+1);
}

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
    num = parseInt(p[0].slice(2));
  }
  return [op, next, vari, num];
}

