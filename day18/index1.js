const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let inst = [];

const R = 0;
const D = 1;
const L = 2;
const U = 3;

let orix = 0;
let oriy = 0;

let vertex = [];

eachLine(filename, function(line) {
  inst.push(line.split(' '));
}).then(function(err) {
  for(let k=0;k<inst.length;k++) {
    inst[k][2] = inst[k][2].substr(2,6);
    inst[k][0] = parseInt(inst[k][2].substr(-1));
    inst[k][1] = parseInt("0x"+inst[k][2].substr(0,5),16);
  }
  //console.log(`The first instruction was ${inst[0][2]} which is direction ${inst[0][0]} and length ${inst[0][1]}`);
  let x = orix;
  let y = oriy;
  vertex.push([y,x]);
  for(let k=0;k<(inst.length-1);k++) {
      switch(inst[k][0]) {
        case R: x+=inst[k][1];break;
        case D: y+=inst[k][1];break;
        case L: x-=inst[k][1];break;
        case U: y-=inst[k][1];break;
      }
      vertex.push([y,x]);
  }
  answer = findArea();
  console.log(answer);
  //console.log(inst);
  //console.log(vertex);
});

function findArea() {
  let numV = vertex.length;
  let j = numV-1;
  let area = 0;
  let per = 0;
  let extC = 0;
  let intC = 0;
  for(let i=0; i<numV; i++) {
    area += (vertex[j][0]-vertex[i][0]) * (vertex[j][1]+vertex[i][1]);
    per += Math.abs(vertex[j][0]-vertex[i][0])+Math.abs(vertex[j][1]-vertex[i][1]);
    j=i;
  }
  area = Math.abs(area)/2;
  //console.log(`Raw area is ${area}`);
  per /= 2;
  //console.log(`Raw per is ${per}`);
  area+=per;
  area+=1;
  return area;
}

