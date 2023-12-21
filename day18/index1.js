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

let maxR = 0;
let maxD = 0;
let maxL = 0;
let maxU = 0;

let maxx = 0;
let maxy = 0;
let minx = 0;
let miny = 0;

let orix = 0;
let oriy = 0;

let field = [];

eachLine(filename, function(line) {
  inst.push(line.split(' '));
}).then(function(err) {
  for(let k=0;k<inst.length;k++) {
    inst[k][2] = inst[k][2].substr(2,6);
    inst[k][0] = parseInt(inst[k][2].substr(-1));
    inst[k][1] = parseInt("0x"+inst[k][2].substr(0,5),16);
    let x=0;
    let y=0;
    switch(inst[k][0]) {
      case R: x += inst[k][1]; if(x>maxR) { maxR=x; } break;
      case U: y += inst[k][1]; if(y>maxU) { maxU=y; } break;
      case L: x -= inst[k][1]; if(x<maxL) { maxL=x; } break;
      case D: y -= inst[k][1]; if(y<maxD) { maxD=y; } break;
    }
  }
  console.log(`The first instruction was ${inst[0][2]} which is direction ${inst[0][0]} and length ${inst[0][1]}`);
  maxx = maxR - maxL + 2;
  maxy = maxU - maxD + 2;
  oriy = maxU + 1;
  orix = maxL + 1;
  console.log(`maxx=${maxx} and maxy=${maxy}`);
  for(let y=0;y<maxy;y++) {
    field[y] = [];
    for(let x=0;x<maxx;x++) {
      field[y][x] = '.';
    }
  }
  let last = inst[inst.length-1][0];
  let cur = inst[0][0];
  let x = orix;
  let y = oriy;
  field[y][x] = corner(last, cur);
  console.log(`The origin is ${y},${x} and the position is ${field[y][x]}`);
  for(let k=0;k<inst.length;k++) {
    for(let i=1;i<inst[k][1];i++) {
      switch(cur) {
        case R: field[y][x+i] = '-'; break;
        case D: field[y+i][x] = '|'; break;
        case L: field[y][x-i] = '-'; break;
        case U: field[y-i][x] = '|'; break;
      }
    }
    if(k<inst.length-1) {
      last = cur;
      cur = inst[k+1][0];
      switch(last) {
        case R: field[y][x+inst[k][1]] = corner(last, cur); x+=inst[k][1];break;
        case D: field[y+inst[k][1]][x] = corner(last, cur); y+=inst[k][1];break;
        case L: field[y][x-inst[k][1]] = corner(last, cur); x-=inst[k][1];break;
        case U: field[y-inst[k][1]][x] = corner(last, cur); y-=inst[k][1];break;
      }
    }
  }
  for(let y=0;y<field.length;y++) {
    let cross=0;
    for(let x=0;x<field[y].length;x++) {
      let ch = field[y][x];
      if(ch==='|'||ch==='F'||ch==='7') {
        cross++;
      }
      if((cross%2)===1&&ch==='.') {
        field[y][x] = '#';
      }
    }
  }
  //printField();
  answer = field.map((m)=>m.filter((f)=>f!=='.').length).reduce((a,b)=>a+b);
  console.log(answer);
});

function corner(l, c) {
  switch(c) {
    case R: return (l===U)?'F':'L'; break;
    case D: return (l===R)?'7':'F'; break;
    case L: return (l===U)?'7':'J'; break;
    case U: return (l===R)?'J':'L'; break;
  }
}

function printField() {
  for(let y=0;y<maxy;y++) {
    console.log(field[y].reduce((a,b)=>a+b));
  }
}
