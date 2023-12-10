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
  let transforms = [];
  for(let s=0;s<seeds.length;s++) {
    transforms[s] = [];
    transforms[s].push(seeds[s]);
    let val = seeds[s];
    for(let m=1;m<maps.length;m++) {
      let added=false;
      for(let k=0;k<maps[m].length&&!added;k++) {
        if(val>=maps[m][k][1]&&val<(maps[m][k][1]+maps[m][k][2])) {
          added = true;
          val = maps[m][k][0] + val - maps[m][k][1];
          transforms[s].push(val);
        }
      }
      if(!added) {
        transforms[s].push(val);
      }
    }
  }
  answer = transforms.map((t)=>t.reduce((a,b)=>b)).reduce((a,b)=>(a<b)?a:b)
  console.log(answer);
});
