const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let seeds = [];

let phase = 0;

let maps = [];

eachLine(filename, function(line) {
  if(line==="") {
    phase++;
    maps[phase] = [];
  } else {
    switch(phase) {
      case 0:
        seeds = line.split(":")[1].trim().split(" ").map((n)=>parseInt(n));
        break;
      default:
        if(!/:/.test(line)) {
          maps[phase].push(line.split(" ").map((n)=>parseInt(n)));
        }
        break;
    }
  }
}).then(function(err) {
  answer = -1;
  for(let c = 0; answer<0; c++) {
    let val = c;
    for(let m=maps.length-1;m>0;m--) {
      let added=false;
      for(let k=0;k<maps[m].length&&!added;k++) {
        if(val>=maps[m][k][0]&&val<(maps[m][k][0]+maps[m][k][2])) {
          added = true;
          val = maps[m][k][1] + val - maps[m][k][0];
        }
      }
    }
    for(let k=0;k<seeds.length&&answer<0;k+=2) {
      if(val>=seeds[k]&&val <(seeds[k]+seeds[k+1])) {
        answer = c;
      }
    }
  }
  console.log(answer);
});
