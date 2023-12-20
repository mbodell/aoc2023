const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let floor = [];
let sequence = [];
let cycles = 1000000000;
let temp = 20000;
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
  for(let s=0;cycle<3 && s<temp;s++) {
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
        if(compare(tilt,sequence[k],seq)) {
          if(cycle===0) {
            first = k;
            last = seq;
          }
          console.log(`We have found a cycle with weight ${sc} from ${first} to ${last}`);
          cycle++;
        } else {
          /*
          if(seq>10000) {
            console.log(`Despite ${sc} and ${weights[k]} being equal this was not a match on ${seq} and ${k}`);
          }*/
        }
      }
    }
    weights.push(sc);
    if(s>0&&s%1000===0) {
      console.log(weights);
      console.log(weights.slice(-100));
    }
  }
  console.log(weights);
  if(first>0) {
    let cycleLen = last - first;
    cycles -= first;
    let rem = cycles % cycleLen;
    answer = weights[first + rem -1];
  } else {
    let n14 = [];
    let n03 = [];
    let n85 = [];
    let n71 = [];
    let n62 = [];
    let n61 = [];
    let n81 = [];
    let n01 = [];
    let n20 = [];
    for(let i=0;i<weights.length;i++) {
      switch(weights[i]) {
        case 96014:
          n14.push(i); 
          break;
        case 96003:
          n03.push(i);
          break;
        case 95985:
          n85.push(i);
          break;
        case 95971:
          n71.push(i);
          break;
        case 95962:
          n62.push(i);
          break;
        case 95961:
          n61.push(i);
          break;
        case 95981:
          n81.push(i);
          break;
        case 96001:
          n01.push(i);
          break;
        case 96020:
          n20.push(i);
          break;
      }
    }
    console.log(n81);
    console.log(n01);
    console.log(n20);

    let fir = n81[10];
     
    let cycleLen = 9;
    cycles -= fir;
    let rem = cycles % cycleLen;
    answer = weights[fir + rem -1];
  }

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
function compare(a,b,s) {
  let ret = true;
  for(let y=0;ret && y<a.length;y++) {
    for(let x=0;ret && x<a[y].length;x++) {
      if(a[y][x]!==b[y][x]) {
        ret = false;
        /*
        if(s>10000) {
          console.log(`with y=${y} and x=${x} we have a non match on ${a[y][x]} and ${b[y][x]}\n${a[y]}\n${b[y]}`);
        }*/
      }
    }
  }
  return ret;
}
