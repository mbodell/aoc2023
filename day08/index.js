const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let instructions = [];
let nodes = {};
eachLine(filename, function(line) {
  if(instructions.length<1) {
    instructions = line.split('').map((c)=>(c==='L'?0:1));
  }
  if(/=/.test(line)) {
    let node = line.split(' = ')[0];
    let left = line.split('(')[1].split(',')[0];
    let right = line.split(', ')[1].split(')')[0];
    nodes[node] = [left, right];
  }
}).then(function(err) {
  let node = "AAA";
  let inst = instructions[0];
  while(node!== "ZZZ") {
    answer++;
    node = nodes[node][inst];
    inst = instructions[answer%instructions.length];
  }
  console.log(answer);
});
