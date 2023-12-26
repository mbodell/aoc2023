const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let land = [];

const PLOT = '.';
const ROCK = '#';
const START = 'S';

let steps = [];

const MAXSTEP = 64;

eachLine(filename, function(line) {
  land.push(line.split(''));
}).then(function(err) {
  console.log(land);
  steps[0] = new Set();
  for(let y=0; y<land.length; y++) {
    for(let x=0; x<land[y].length; x++) {
      if(land[y][x]===START) {
	steps[0].add(y.toString() +","+x.toString());
	console.log(`Start is ${y} and ${x}`);
	console.log(steps[0]);
      }
    }
  }
  for(let k=0; k<=MAXSTEP; k++) {
    steps[k+1] = new Set();
    console.log(`In loop ${k} and we have ${steps[k].size} items`);
    console.log(steps[k]);
    for(const item of steps[k].values()) {
      advance(item, k+1);
    }
  }
  answer = steps[MAXSTEP].size;
  console.log(answer);
});

function advance(s, i) {
  let pos = s.split(",");
  let y = parseInt(pos[0]);
  let x = parseInt(pos[1]);

  if(y>0 && land[y-1][x] !== ROCK) {
    let str = (y-1).toString() + "," + x.toString();
    steps[i].add(str);
  } 
  if(y+1<land.length && land[y+1][x] !== ROCK) {
    let str = (y+1).toString() + "," + x.toString();
    steps[i].add(str);
  } 
  if(x>0 && land[y][x-1] !== ROCK) {
    let str = y.toString() + "," + (x-1).toString();
    steps[i].add(str);
  } 
  if(x+1<land[y].length && land[y][x+1] !== ROCK) {
    let str = y.toString() + "," + (x+1).toString();
    steps[i].add(str);
  } 
}
