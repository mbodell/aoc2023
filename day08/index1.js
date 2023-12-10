const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let instructions = [];
let nodes = {};
let pos = [];
let factors = [];
let remainders = [];
let multiples = [];
eachLine(filename, function(line) {
  if(instructions.length<1) {
    instructions = line.split('').map((c)=>(c==='L'?0:1));
  }
  if(/=/.test(line)) {
    let node = line.split(' = ')[0];
    let left = line.split('(')[1].split(',')[0];
    let right = line.split(', ')[1].split(')')[0];
    nodes[node] = [left, right];
    if(node[2] === 'A') {
      pos.push(node);
      factors.push([]);
      remainders.push([]);
      multiples.push([]);
    }
  }
}).then(function(err) {
  console.log(pos);
  console.log(instructions.length);
  let done = false;
  let inst = instructions[0];
  while(!done&&answer<200002) {
    answer++;
    done = true;
    for(let k=0;k<pos.length;k++) {
      pos[k] = nodes[pos[k]][inst];
      if(pos[k][2]!=='Z') {
        done = false;
        if(pos[k][2]==='A') {
          console.log(`On step ${answer} item ${k} is back in state ${pos[k]}`);
        }
      } else {
        factors[k].push(answer);
        remainders[k].push(answer%instructions.length);
        multiples[k].push(answer/instructions.length);
        //console.log(`On step ${answer} item ${k} is in state ${pos[k]}`);
      }
    }
    inst = instructions[answer%instructions.length];
    if((answer%100000)===0) {
      console.log(`pos is ${pos} done is ${done} and inst is ${inst} and answer is ${answer}`);
      for(let k=0;k<pos.length;k++) {
        console.log(factors[k]);
        console.log(remainders[k]);
        console.log(multiples[k]);
      }
    }
  }
  if(!done) {
    let lcm = multiples[0][0];
    console.log(`First multiple is ${lcm}`);
    for(let k=1;k<pos.length;k++) {
      let hcf = 1;
      for(let i=1;i<=lcm && i<=multiples[k][0];i++) {
        if(lcm % i === 0 && multiples[k][0] % i === 0) {
          hcf = i;
        }
      }
      console.log(`The hcf of ${lcm} and ${multiples[k][0]} is ${hcf}`);
      lcm = lcm / hcf * multiples[k][0];
      console.log(`The new lcm is ${lcm}`);
    }
    answer = lcm * instructions.length;
  }
  console.log(answer);
});
