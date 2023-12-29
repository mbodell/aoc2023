const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let land = [];

const PLOT = '.';
const ROCK = '#';
const START = 'S';

let oddC = 0;
let evenC = 1;

let lastOdd = new Set();
let lastEven = new Set();

let update = 2;

const MAXSTEP = 26501365;

eachLine(filename, function(line) {
  land.push(line.split(''));
}).then(function(err) {
  console.log(land);
  lastEven = new Set();
  for(let y=0; y<land.length; y++) {
    for(let x=0; x<land[y].length; x++) {
      if(land[y][x]===START) {
	lastEven.add(y.toString() +","+x.toString()+",0,0");
	console.log(`Start is ${y} and ${x}`);
      }
    }
  }
  for(let k=0; k<=MAXSTEP; k++) {
    let nextEven = new Set();
    let nextOdd = new Set();
    let st;
    let last;
    let ne;
    if(k%2===0) {
      st = lastEven;
      last = lastOdd;
      ne = nextOdd;
    } else {
      st = lastOdd;
      last = lastEven;
      ne = nextEven;
    }
    //console.log(`In loop ${k} and we have ${steps[k].size} items`);
    //console.log(steps[k]);
    for(const item of st.values()) {
      advance(item, last, ne);
    }
    //console.log(`In step ${k} and last has size ${last.size} and next has size ${ne.size}`);
    //console.log(ne);
    if(k%2===0) {
      oddC += ne.size;
      lastOdd = ne;
    } else {
      evenC += ne.size;
      lastEven = ne;
    }
    if(k%update===1) {
      update*=2;
      console.log(`In exactly ${k} steps, he can still reach ${oddC} steps, whereas in ${k-1} steps he could reach ${evenC} steps.`);
    }
  }
  answer = ((MAXSTEP%2)===0)?evenC:oddC;
  console.log(answer);
});

function advance(s, last, next) {
  let pos = s.split(",");
  let y = parseInt(pos[0]);
  let x = parseInt(pos[1]);
  let dy = parseInt(pos[2]);
  let dx = parseInt(pos[3]);

  if(y>0 && land[y-1][x] !== ROCK) {
    let str = (y-1).toString() + "," + x.toString() + "," + dy.toString() + "," + dx.toString();
    if(!last.has(str)) {
      next.add(str);
    }
  } else if(y===0 && land[land.length-1][x] !== ROCK) {
    let str = (land.length-1).toString() + "," + x.toString() + "," + (dy-1).toString() + "," + dx.toString();
    if(!last.has(str)) {
      next.add(str);
    }
  }
  if(y+1<land.length && land[y+1][x] !== ROCK) {
    let str = (y+1).toString() + "," + x.toString() + "," + dy.toString() + "," + dx.toString();
    if(!last.has(str)) {
      next.add(str);
    }
  } else if(y+1 === land.length && land[0][x] !== ROCK) {
    let str = "0," + x.toString() + "," + (dy+1).toString() + "," + dx.toString();
    if(!last.has(str)) {
      next.add(str);
    }
  }
  if(x>0 && land[y][x-1] !== ROCK) {
    let str = y.toString() + "," + (x-1).toString() + "," + dy.toString() + "," + dx.toString();
    if(!last.has(str)) {
      next.add(str);
    }
  } else if(x===0 && land[y][land[y].length-1] !== ROCK) {
    let str = y.toString() + "," + (land[y].length-1).toString() + "," + dy.toString() + "," + (dx-1).toString();
    if(!last.has(str)) {
      next.add(str);
    }
  }
  if(x+1<land[y].length && land[y][x+1] !== ROCK) {
    let str = y.toString() + "," + (x+1).toString() + "," + dy.toString() + "," + dx.toString();
    if(!last.has(str)) {
      next.add(str);
    }
  } else if(x+1===land[y].length && land[y][0] !== ROCK) {
    let str = y.toString() + ",0," + dy.toString() + "," + (dx+1).toString();
    if(!last.has(str)) {
      next.add(str);
    }
  }
}
