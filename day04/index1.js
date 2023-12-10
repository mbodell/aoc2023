const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let cards = [];
let winners = [];
let copies = [];

eachLine(filename, function(line) {
  let card = line.split(":")[1].trim();
  cards.push(card.split(" | ").map((s)=>s.trim().split(" ").filter((f) => /\d+/.test(f)).map((n)=>parseInt(n))));
}).then(function(err) {
  for(let k=0;k<cards.length;k++) {
    let num = cards[k][0].filter(value => cards[k][1].includes(value)).length;
    winners.push(num);
    copies[k]=1;
  }
  for(let k=0;k<cards.length;k++) {
    for(let j=k+1;j<=k+winners[k];j++) {
      copies[j] += copies[k];
    }
  }
  answer = copies.reduce((a,b)=>a+b);
  console.log(answer);
});
