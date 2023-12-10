const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let hands = [];
let bids = [];
let ranks = [];
let types = [];

eachLine(filename, function(line) {
  let inp = line.trim().split(' ');
  hands.push(inp[0].split('').map((c)=>/\d/.test(c)?parseInt(c):(c==='T'?10:(c==='J'?11:(c==='Q'?12:(c==='K'?13:14))))));
  bids.push(parseInt(inp[1]));
}).then(function(err) {
  let total = hands.length;
  for(let h=0;h<hands.length;h++) {
    let hand = hands[h].toSorted();
    if(hand[0]===hand[1]&&hand[2]===hand[3]&&hand[4]===hand[3]&&hand[1]===hand[2]) {
      types.push(7);
    } else if((hand[0]===hand[1]&&hand[2]===hand[3]&&hand[1]===hand[2]) ||
              (hand[1]===hand[2]&&hand[3]===hand[4]&&hand[2]===hand[3])) {
      types.push(6);
    } else if(hand[0]===hand[1]&&hand[3]===hand[4]&&(hand[2]===hand[1]||hand[2]===hand[3])) {
      types.push(5);
    } else if((hand[0]===hand[1]&&hand[1]===hand[2]) ||
              (hand[1]===hand[2]&&hand[2]===hand[3]) ||
              (hand[2]===hand[3]&&hand[3]===hand[4])) {
      types.push(4);
    } else if((hand[0]===hand[1]&&(hand[2]===hand[3]||hand[3]===hand[4])) ||
              (hand[1]===hand[2]&&hand[3]===hand[4])) {
      types.push(3);
    } else if(hand[0]===hand[1]||hand[1]===hand[2]||hand[2]===hand[3]||hand[3]===hand[4]) {
      types.push(2);
    } else {
      types.push(1);
    }
  }
  for(let k=0;k<total;k++) {
    let beat = 0;
    for(let j=0;j<total;j++) {
      if(k!==j) {
        if(types[k]>types[j]) {
          beat++;
        } else if(types[k]===types[j]) {
          let cont = true;
          for(let x=0;x<hands[k].length&&cont;x++) {
            if(hands[k][x]>hands[j][x]) {
              cont = false;
              beat++;
            } else if (hands[k][x]<hands[j][x]) {
              cont = false;
            }
          }
        }
      }
    }
    ranks.push(beat+1);
  }
  for(let k=0;k<total;k++) {
    answer += ranks[k]*bids[k];
  }
  console.log(answer);
});
