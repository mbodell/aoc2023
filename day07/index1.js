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
  hands.push(inp[0].split('').map((c)=>/\d/.test(c)?parseInt(c):(c==='T'?10:(c==='J'?1:(c==='Q'?12:(c==='K'?13:14))))));
  bids.push(parseInt(inp[1]));
}).then(function(err) {
  let total = hands.length;
  for(let h=0;h<hands.length;h++) {
    let hand = hands[h].toSorted();
    let wild=0;
    for(let k=0;k<hand.length;k++) {
      if(hand[k]===1) {
        wild++;
      }
    }
    let type = -1;
    if(hand[0]===hand[1]&&hand[2]===hand[3]&&hand[4]===hand[3]&&hand[1]===hand[2]) {
      type = 7;
    } else if((hand[0]===hand[1]&&hand[2]===hand[3]&&hand[1]===hand[2]) ||
              (hand[1]===hand[2]&&hand[3]===hand[4]&&hand[2]===hand[3])) {
      type = 6;
    } else if(hand[0]===hand[1]&&hand[3]===hand[4]&&(hand[2]===hand[1]||hand[2]===hand[3])) {
      type = 5;
    } else if((hand[0]===hand[1]&&hand[1]===hand[2]) ||
              (hand[1]===hand[2]&&hand[2]===hand[3]) ||
              (hand[2]===hand[3]&&hand[3]===hand[4])) {
      type = 4;
    } else if((hand[0]===hand[1]&&(hand[2]===hand[3]||hand[3]===hand[4])) ||
              (hand[1]===hand[2]&&hand[3]===hand[4])) {
      type = 3;
    } else if(hand[0]===hand[1]||hand[1]===hand[2]||hand[2]===hand[3]||hand[3]===hand[4]) {
      type = 2;
    } else {
      type = 1;
    }
    switch(wild) {
      case 0:
      case 5:
        break;
      case 1:
        switch(type) {
          case 1:
            type = 2;
            break;
          case 2:
            type = 4;
            break;
          case 3:
            type = 5;
            break;
          case 4:
            type = 6;
            break;
          case 6:
            type = 7;
            break;
          default:
            throw err;
            break;
        }
        break;
      case 2:
        switch(type) {
          case 2:
            type = 4;
            break;
          case 3:
            type = 6;
            break;
          case 5:
            type = 7;
            break;
          default:
            throw err;
            break;
        }
        break;
      case 3:
        switch(type) {
          case 4:
            type = 6;
            break;
          case 5:
            type = 7;
            break;
          default:
            throw err;
            break;
        }
        break;
      case 4:
        type = 7;
        break;
      default:
        throw err;
        break;
    }
    types.push(type);
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
