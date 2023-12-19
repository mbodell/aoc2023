const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let floor = [];
let sequence = [];
let cycles = 1000000000;
let weights = [];

eachLine(filename, function(line) {
  floor.push(line.split(''));
}).then(function(err) {
  let tilt = [];
  let rec = floor;
  sequence.push(floor);
  let cycle = 0;
  let first = -1;
  let last = -1;
  let seq = 0;
  for(let s=0;cycle<3 && s<cycles;s++) {
    // go North
    tilt = [];
    for(let y=0;y<rec.length;y++) {
      tilt.push([]);
      for(let x=0;x<rec[y].length;x++) {
        tilt[y][x] = rec[y][x];
        if(tilt[y][x] === 'O') {
          let valid = true;
          for(let d=1;valid&&(y-d)>=0;d++) {
            if(tilt[y-d][x]==='.') {
              tilt[y-d+1][x] = '.';
              tilt[y-d][x] = 'O';
            } else {
              valid = false;
            }
          }
        }
      }
    }
    rec = tilt;
    // go West
    tilt = [];
    for(let y=0;y<rec.length;y++) {
      tilt.push([]);
    }
    for(let x=0;x<rec[0].length;x++) {
      for(let y=0;y<rec.length;y++) {
        tilt[y][x] = rec[y][x];
        if(tilt[y][x] === 'O') {
          let valid = true;
          for(let d=1;valid&&(x-d)>=0;d++) {
            if(tilt[y][x-d]==='.') {
              tilt[y][x-d+1] = '.';
              tilt[y][x-d] = 'O';
            } else {
              valid = false;
            }
          }
        }
      }
    }
    rec = tilt;
    // go South
    tilt = [];
    for(let y=0;y<rec.length;y++) {
      tilt.push([]);
    }
    for(let y=rec.length-1;y>=0;y--) {
      for(let x=0;x<rec[y].length;x++) {
        tilt[y][x] = rec[y][x];
        if(tilt[y][x] === 'O') {
          let valid = true;
          for(let d=1;valid&&(y+d)<rec.length;d++) {
            if(tilt[y+d][x]==='.') {
              tilt[y+d-1][x] = '.';
              tilt[y+d][x] = 'O';
            } else {
              valid = false;
            }
          }
        }
      }
    }
    rec = tilt;
    // go East
    tilt = [];
    for(let y=0;y<rec.length;y++) {
      tilt.push([]);
    }
    for(let x=rec[0].length-1;x>=0;x--) {
      for(let y=0;y<rec.length;y++) {
        tilt[y][x] = rec[y][x];
        if(tilt[y][x] === 'O') {
          let valid = true;
          for(let d=1;valid&&(x+d)<rec[y].length;d++) {
            if(tilt[y][x+d]==='.') {
              tilt[y][x+d-1] = '.';
              tilt[y][x+d] = 'O';
            } else {
              valid = false;
            }
          }
        }
      }
    }
    rec = tilt;
    sequence.push(tilt);
    seq++;
    let sc = score(tilt);
    for(let k=0;k<weights.length;k++) {
      if(sc === weights[k]) {
        if(compare(tilt,sequence[k])) {
          if(cycle===0) {
            first = k;
            last = seq;
          }
          console.log(`We have found a cycle with weight ${sc} from ${first} to ${last}`);
          cycle++;
        }
      }
    }
    weights.push(sc);
    if(s>0&&s%1000===0) {
      console.log(weights);
    }
  }
  console.log(weights);
  let cycleLen = last - first;
  cycles -= first;
  let rem = cycles % cycleLen;
  answer = weights[first + rem -1];

  console.log(answer);
});

function score(tilt) {
  let weight = tilt.length;
  let a = 0;
  for(let k=0;k<weight;k++) {
    a += tilt[k].filter((f)=>f==='O').length * (weight-k);
  }
  return a;
}
function compare(a,b) {
  let ret = true;
  for(let y=0;ret && y<a.length;y++) {
    for(let x=0;ret && x<a[y].length;x++) {
      if(a[y][x]!==b[y][x]) {
        ret = false;
      }
    }
  }
  return ret;
}
