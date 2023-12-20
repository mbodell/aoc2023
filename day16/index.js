const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let cave = [];
let right = [];
let up = [];
let left = [];
let down = [];
let rays = [];
let combo = [];

eachLine(filename, function(line) {
  cave.push(line.split(''));
}).then(function(err) {
  for(let y=0;y<cave.length;y++) {
    right[y] = [];
    up[y] = [];
    left[y] = [];
    down[y] = [];
    for(let x=0;x<cave[y].length;x++) {
      right[y][x] = 0;
      up[y][x] = 0;
      left[y][x] = 0;
      down[y][x] = 0;
    }
  }
  switch(cave[0][0]) {
    case '.':
    case '-':
      rays.push([0, [0, 0]]);
      break;
    case '|':
    case '\\':
      rays.push([3, [0, 0]]);
      break;
    case '/':
      rays.push([1, [0, 0]]);
      break;
  }
  while(rays.length>0) {
    let ray = rays.shift();
    switch(ray[0]) {
      case 0:
        // right
        expandRight(ray[1]);
        break;
      case 1:
        // up
        expandUp(ray[1]);
        break;
      case 2:
        // left
        expandLeft(ray[1]);
        break;
      case 3:
        // down
        expandDown(ray[1]);
        break;
    }
  }
  for(let y=0;y<cave.length;y++) {
    combo[y] = [];
    for(let x=0;x<cave[y].length;x++) {
      combo[y][x] = right[y][x] + up[y][x] + left[y][x] + down[y][x];
      if(combo[y][x]>0) {
        answer++;
      }
    }
  }
  console.log(answer);
});

function expandRight(arr) {
  let done = false;
  for(let x=arr[1];!done&&x<right[arr[0]].length;x++) {
    if(x!==arr[1]&&right[arr[0]][x]>200) {
      done = true;
    } else if(x!==arr[1]) {
      switch(cave[arr[0]][x]) {
        case '.':
        case '-':
          right[arr[0]][x]++;
          break;
        case '|':
          right[arr[0]][x]++;
          rays.push([1, [arr[0], x]]);
          rays.push([3, [arr[0], x]]);
          done=true;
          break;
        case '/':
          right[arr[0]][x]++;
          rays.push([1, [arr[0], x]]);
          done=true;
          break;
        case '\\':
          right[arr[0]][x]++;
          rays.push([3, [arr[0], x]]);
          done=true;
          break;
      }
    } else {
      right[arr[0]][arr[1]]++;
    }
  }
}

function expandUp(arr) {
  let done = false;
  for(let y=arr[0];!done&&y>=0;y--) {
    if(y!==arr[0]&&up[y][arr[1]]>200) {
      done = true;
    } else if(y!==arr[0]) {
      switch(cave[y][arr[1]]) {
        case '.':
        case '|':
          up[y][arr[1]]++;
          break;
        case '-':
          up[y][arr[1]]++;
          rays.push([0, [y, arr[1]]]);
          rays.push([2, [y, arr[1]]]);
          done=true;
          break;
        case '/':
          up[y][arr[1]]++;
          rays.push([0, [y, arr[1]]]);
          done=true;
          break;
        case '\\':
          up[y][arr[1]]++;
          rays.push([2, [y, arr[1]]]);
          done=true;
          break;
      }
    } else {
      up[arr[0]][arr[1]]++;
    }
  }
}

function expandLeft(arr) {
  let done = false;
  for(let x=arr[1];!done&&x>=0;x--) {
    if(x!==arr[1]&&left[arr[0]][x]>200) {
      done = true;
    } else if(x!==arr[1]) {
      switch(cave[arr[0]][x]) {
        case '.':
        case '-':
          left[arr[0]][x]++;
          break;
        case '|':
          left[arr[0]][x]++;
          rays.push([1, [arr[0], x]]);
          rays.push([3, [arr[0], x]]);
          done=true;
          break;
        case '/':
          left[arr[0]][x]++;
          rays.push([3, [arr[0], x]]);
          done=true;
          break;
        case '\\':
          left[arr[0]][x]++;
          rays.push([1, [arr[0], x]]);
          done=true;
          break;
      }
    } else {
     left[arr[0]][arr[1]]++;
    } 
  }
}

function expandDown(arr) {
  let done = false;
  for(let y=arr[0];!done&&y<down.length;y++) {
    if(y!==arr[0]&&down[y][arr[1]]>200) {
      done = true;
    } else if(y!==arr[0]) {
      switch(cave[y][arr[1]]) {
        case '.':
        case '|':
          down[y][arr[1]]++;
          break;
        case '-':
          down[y][arr[1]]++;
          rays.push([0, [y, arr[1]]]);
          rays.push([2, [y, arr[1]]]);
          done=true;
          break;
        case '/':
          down[y][arr[1]]++;
          rays.push([2, [y, arr[1]]]);
          done=true;
          break;
        case '\\':
          down[y][arr[1]]++;
          rays.push([0, [y, arr[1]]]);
          done=true;
          break;
      }
    } else {
      down[arr[0]][arr[1]]++;
    }
  }
}

