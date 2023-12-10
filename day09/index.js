const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let sequences = [];
let predictions = [];
eachLine(filename, function(line) {
  sequences.push(line.split(" ").map((n)=>parseInt(n)));
}).then(function(err) {
  for(let k=0;k<sequences.length;k++) {
    let helpers = [];
    helpers[0] = sequences[k];
    let done = false;
    while(!done) {
      let nextRow = [];
      let curHelp = helpers.length-1;
      for(let j=1;j<helpers[curHelp].length;j++) {
        nextRow.push(helpers[curHelp][j]-helpers[curHelp][j-1]);
      }
      helpers.push(nextRow);
      if(nextRow.filter((f)=>f!==0).length===0) {
        done = true;
      }
    }
    predictions.push(helpers.map((a)=>a.reduce((x,y)=>y)).reduce((a,b)=>a+b));
  }
  answer = predictions.reduce((a,b)=>a+b);
  console.log(answer);
});
