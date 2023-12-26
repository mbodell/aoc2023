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

const MAXSTEP = 26501365;

eachLine(filename, function(line) {
  land.push(line.split(''));
}).then(function(err) {
  console.log(land);
  steps[0] = new Set();
  for(let y=0; y<land.length; y++) {
    for(let x=0; x<land[y].length; x++) {
      if(land[y][x]===START) {
	steps[0].add(y.toString() +","+x.toString()+",0,0");
	console.log(`Start is ${y} and ${x}`);
	console.log(steps[0]);
      }
    }
  }
  for(let k=0; k<=MAXSTEP; k++) {
    steps[k+1] = new Set();
    //console.log(`In loop ${k} and we have ${steps[k].size} items`);
    //console.log(steps[k]);
    for(const item of steps[k].values()) {
      advance(item, k+1);
    }
    if(k===6||k===50||k===10||k===100||k===500||k===1000||k==5000) {
      console.log(`In exactly ${k} steps, he can still reach ${steps[k].size} garden plots`);
    }
  }
  answer = steps[MAXSTEP].size;
  console.log(answer);
});

function advance(s, i) {
  let pos = s.split(",");
  let y = parseInt(pos[0]);
  let x = parseInt(pos[1]);
  let dy = parseInt(pos[2]);
  let dx = parseInt(pos[3]);

  if(y>0 && land[y-1][x] !== ROCK) {
    let str = (y-1).toString() + "," + x.toString() + "," + dy.toString() + "," + dx.toString();
    steps[i].add(str);
  } else if(y===0 && land[land.length-1][x] !== ROCK) {
    let str = (land.length-1).toString() + "," + x.toString() + "," + (dy-1).toString() + "," + dx.toString();
    steps[i].add(str);
  }
  if(y+1<land.length && land[y+1][x] !== ROCK) {
    let str = (y+1).toString() + "," + x.toString() + "," + dy.toString() + "," + dx.toString();
    steps[i].add(str);
  } else if(y+1 === land.length && land[0][x] !== ROCK) {
    let str = "0," + x.toString() + "," + (dy+1).toString() + "," + dx.toString();
    steps[i].add(str);
  }
  if(x>0 && land[y][x-1] !== ROCK) {
    let str = y.toString() + "," + (x-1).toString() + "," + dy.toString() + "," + dx.toString();
    steps[i].add(str);
  } else if(x===0 && land[y][land[y].length-1] !== ROCK) {
    let str = y.toString() + "," + (land[y].length-1).toString() + "," + dy.toString() + "," + (dx-1).toString();
    steps[i].add(str);
  }
  if(x+1<land[y].length && land[y][x+1] !== ROCK) {
    let str = y.toString() + "," + (x+1).toString() + "," + dy.toString() + "," + dx.toString();
    steps[i].add(str);
  } else if(x+1===land[y].length && land[y][0] !== ROCK) {
    let str = y.toString() + ",0," + dy.toString() + "," + (dx+1).toString();
    steps[i].add(str);
  }
}
