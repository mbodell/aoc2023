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
    let start = -1;
    let end = -1;
    for(let j=0;j<grid[i].length;j++) {
      if(/\d/.test(grid[i][j])) {
        if(start < 0) {
          start = j;
        }
      } else if(start >= 0) {
        end = j;
        let number = 0;
        let part = false;
        for(let k=start;k<j;k++) {
          number *= 10;
          number += parseInt(grid[i][k]);
        }
        let teststart = start - 1;
        if(teststart<0) {
          teststart = 0;
        }
        let testend = end+1;
        if(testend > grid[i].length) {
          testend -= 1;
        }
        if(i>0) {
          for(let k=teststart; !part && k<testend; k++) {
            if(!/(\.|\d)/.test(grid[i-1][k])) {
              part = true;
            }
          }
        }
        if(i+1<grid.length) {
          for(let k=teststart; !part && k<testend; k++) {
            if(!/(\.|\d)/.test(grid[i+1][k])) {
              part = true;
            }
          }
        }
        for(let k=teststart; !part && k<testend; k++) {
          if(!/(\.|\d)/.test(grid[i][k])) {
            part = true;
          }
        }
        if (part) {
          numbers.push(number);
        }
        start = -1;
        end = -1;
      }
    }
    if(start > 0) {
      end = grid[i].length;
      let number = 0;
      let part = false;
      for(let k=start;k<end;k++) {
        number *= 10;
        number += parseInt(grid[i][k]);
      }
      let teststart = start - 1;
      if(teststart<0) {
        teststart = 0;
      }
      let testend = end+1;
      if(testend > grid[i].length) {
        testend -= 1;
      }
      if(i>0) {
        for(let k=teststart; !part && k<testend; k++) {
          if(!/(\.|\d)/.test(grid[i-1][k])) {
            part = true;
          }
        }
      }
      if(i+1<grid.length) {
        for(let k=teststart; !part && k<testend; k++) {
          if(!/(\.|\d)/.test(grid[i+1][k])) {
            part = true;
          }
        }
      }
      for(let k=teststart; !part && k<testend; k++) {
        if(!/(\.|\d)/.test(grid[i][k])) {
          part = true;
        }
      }
      if (part) {
        numbers.push(number);
      }
      start = -1;
      end = -1;
    }
  }
  answer = numbers.reduce((a,b) => a+b);
  console.log(answer);
});
