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
let maxAnswer = -1;

eachLine(filename, function(line) {
  cave.push(line.split(''));
}).then(function(err) {
  for(let d=0;d<4;d++) {
    let maxC = cave[0].length-1;
    let maxD = cave.length-1;
    if(d<2) {
      for(let k=0;k<cave.length;k++) {
        if(d===0) {
          switch(cave[k][0]) {
            case '.':
            case '-':
              rays.push([0, [k, 0]]);
              break;
            case '|':
              rays.push([3, [k, 0]]);
              rays.push([1, [k, 0]]);
              break;
            case '\\':
              rays.push([3, [k, 0]]);
              break;
            case '/':
              rays.push([1, [k, 0]]);
              break;
          }
        } else {
          switch(cave[k][maxC]) {
            case '.':
            case '-':
              rays.push([2, [k, maxC]]);
              break;
            case '|':
              rays.push([1, [k, maxC]]);
              rays.push([3, [k, maxC]]);
              break;
            case '\\':
              rays.push([1, [k, maxC]]);
              break;
            case '/':
              rays.push([3, [k, maxC]]);
              break;
          }
        }
        expandRays(d, rays[0]);
      }
    } else {
      for(let k=0;k<cave[0].length;k++) {
        if(d===3) {
          switch(cave[0][k]) {
            case '.':
            case '|':
              rays.push([3, [0, k]]);
              break;
            case '-':
              rays.push([0, [0, k]]);
              rays.push([2, [0, k]]);
              break;
            case '\\':
              rays.push([0, [0, k]]);
              break;
            case '/':
              rays.push([2, [0, k]]);
              break;
          }
        } else {
          switch(cave[maxD][k]) {
            case '.':
            case '|':
              rays.push([1, [maxD, k]]);
              break;
            case '-':
              rays.push([0, [maxD, k]]);
              rays.push([2, [maxD, k]]);
              break;
            case '\\':
              rays.push([2, [maxD, k]]);
              break;
            case '/':
              rays.push([0, [maxD, k]]);
              break;
          }
        }
        expandRays(d, rays[0]);
      }
    }
  }
  answer = maxAnswer;
  console.log(answer);
});

function expandRays(d,r) {
  let rx = r[1][1];
  let ry = r[1][0];
  let rd = r[0];
  answer = 0;
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
  if(answer>maxAnswer) {
    maxAnswer = answer;
  }
  //console.log(`In expand Rays on d:${d} with rd:${rd} direction at [${ry},${rx}] starting point and ${answer} as the answer`);
  rays = [];
}

function expandRight(arr) {
  let done = false;
  for(let x=arr[1];!done&&x<right[arr[0]].length;x++) {
    if(x!==arr[1]&&right[arr[0]][x]>500) {
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
    if(y!==arr[0]&&up[y][arr[1]]>500) {
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
    if(x!==arr[1]&&left[arr[0]][x]>500) {
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
    if(y!==arr[0]&&down[y][arr[1]]>500) {
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

