const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let grid = [];
let numbers = [];

eachLine(filename, function(line) {
  grid.push(line.split(""));
}).then(function(err) {
  for(let i=0;i<grid.length;i++) {
    for(let j=0;j<grid[i].length;j++) {
      if(/\*/.test(grid[i][j])) {
        let l=false;
        let r=false;
        let t=false;
        let b=false;
        let tr=false;
        let tl=false;
        let br=false;
        let bl=false;
        let num = 0;
        if(j>0) {
          if(/\d/.test(grid[i][j-1])) {
            l=true;
            num++;
          }
        }
        if(j<grid[i].length) {
          if(/\d/.test(grid[i][j+1])) {
            r=true;
            num++;
          }
        }
        if(i>0) {
          if(/\d/.test(grid[i-1][j])) {
            t=true;
            num++;
          } else {
            if(j>0&&/\d/.test(grid[i-1][j-1])) {
              tl=true;
              num++;
            }
            if(j<grid[i].length && /\d/.test(grid[i-1][j+1])) {
              tr=true;
              num++;
            }
          }
        }
        if(i<grid.length) {
          if(/\d/.test(grid[i+1][j])) {
            b=true;
            num++;
          } else {
            if(j>0&&/\d/.test(grid[i+1][j-1])) {
              bl=true;
              num++;
            }
            if(j<grid[i].length && /\d/.test(grid[i+1][j+1])) {
              br=true;
              num++;
            }
          }
        }
        if(num===2) {
          let gears=[];
          if(l) {
            let start = j-1;
            let flag = true;
            for(let k=start;k>=0&&flag;k--) {
              if(!/\d/.test(grid[i][k])) {
                flag = false;
              } else {
                start=k;
              }
            }
            let number=0;
            for(let k=start;k<j;k++) {
              number *= 10;
              number += parseInt(grid[i][k]);
            }
            gears.push(number);
          }
          if(tl) {
            let start = j-1;
            let flag = true;
            for(let k=start;k>=0&&flag;k--) {
              if(!/\d/.test(grid[i-1][k])) {
                flag = false;
              } else {
                start=k;
              }
            }
            let number=0;
            for(let k=start;k<j;k++) {
              number *= 10;
              number += parseInt(grid[i-1][k]);
            }
            gears.push(number);
          }
          if(bl) {
            let start = j-1;
            let flag = true;
            for(let k=start;k>=0&&flag;k--) {
              if(!/\d/.test(grid[i+1][k])) {
                flag = false;
              } else {
                start=k;
              }
            }
            let number=0;
            for(let k=start;k<j;k++) {
              number *= 10;
              number += parseInt(grid[i+1][k]);
            }
            gears.push(number);
          }
          if(r) {
            let end = j+1;
            let flag = true;
            for(let k=end;k<grid[i].length&&flag;k++) {
              if(!/\d/.test(grid[i][k])) {
                flag = false;
              } else {
                end=k;
              }
            }
            let number=0;
            for(let k=j+1;k<=end;k++) {
              number *= 10;
              number += parseInt(grid[i][k]);
            }
            gears.push(number);
          }
          if(tr) {
            let end = j+1;
            let flag = true;
            for(let k=end;k<grid[i-1].length&&flag;k++) {
              if(!/\d/.test(grid[i-1][k])) {
                flag = false;
              } else {
                end=k;
              }
            }
            let number=0;
            for(let k=j+1;k<=end;k++) {
              number *= 10;
              number += parseInt(grid[i-1][k]);
            }
            gears.push(number);
          }
          if(br) {
            let end = j+1;
            let flag = true;
            for(let k=end;k<grid[i+1].length&&flag;k++) {
              if(!/\d/.test(grid[i+1][k])) {
                flag = false;
              } else {
                end=k;
              }
            }
            let number=0;
            for(let k=j+1;k<=end;k++) {
              number *= 10;
              number += parseInt(grid[i+1][k]);
            }
            gears.push(number);
          }
          if(t) {
            let start=j;
            let end=j;
            let flag = true;
            for(let k=start;k>=0&&flag;k--) {
              if(!/\d/.test(grid[i-1][k])) {
                flag = false;
              } else {
                start = k;
              }
            }
            flag = true;
            for(let k=end;k<grid[i-1].length&&flag;k++) {
              if(!/\d/.test(grid[i-1][k])) {
                flag = false;
              } else {
                end=k;
              }
            }
            let number=0;
            for(let k=start;k<=end;k++) {
              number *= 10;
              number += parseInt(grid[i-1][k]);
            }
            gears.push(number);
          }
          if(b) {
            let start=j;
            let end=j;
            let flag = true;
            for(let k=start;k>=0&&flag;k--) {
              if(!/\d/.test(grid[i+1][k])) {
                flag = false;
              } else {
                start = k;
              }
            }
            flag = true;
            for(let k=end;k<grid[i+1].length&&flag;k++) {
              if(!/\d/.test(grid[i+1][k])) {
                flag = false;
              } else {
                end=k;
              }
            }
            let number=0;
            for(let k=start;k<=end;k++) {
              number *= 10;
              number += parseInt(grid[i+1][k]);
            }
            gears.push(number);
          }
          numbers.push(gears.reduce((a,b) => a*b));
        }
      }
    }
  }
  answer = numbers.reduce((a,b) => a+b);
  console.log(answer);
});
