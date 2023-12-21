const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let island = [];
let tarx = -1;
let tary = -1;

const RI = 0;
const DO = 1;
const LE = 2;
const UP = 3;

let visit = [];

let paths = [];

let maxD = 3;

eachLine(filename, function(line) {
  island.push(line.split('').map((m)=>parseInt(m)));
}).then(function(err) {
  console.log(island);
  tarx = island[0].length - 1;
  tary = island.length - 1;
  console.log(`Trying to get to ${tary} by ${tarx}`);
  visit[RI] = [];
  visit[DO] = [];
  visit[LE] = [];
  visit[UP] = [];
  for(let y=0;y<=tary;y++) {
      visit[RI][y] = [];
      visit[DO][y] = [];
      visit[LE][y] = [];
      visit[UP][y] = [];
    for(let x=0;x<=tarx;x++) {
      visit[RI][y][x] = [];
      visit[DO][y][x] = [];
      visit[LE][y][x] = [];
      visit[UP][y][x] = [];
      for(let d=0;d<maxD;d++) {
        visit[RI][y][x][d] = 0;
        visit[DO][y][x][d] = 0;
        visit[LE][y][x][d] = 0;
        visit[UP][y][x][d] = 0;
      }
    }
  }
  let maxPath = tarx*tary*maxD*9;
  console.log(`Max path is ${maxPath}`);
  for(k=0;k<maxPath;k++) {
    paths[k] = [];
  }
  console.log(paths);
  paths[0+heur(0,0)].push([0, "", 0, 0]);
  console.log(paths);
  let done = false;
  for(let p=0;!done;p++) {
    console.log(`Trying loops of length+heuristic of ${p}`);
    while(!done&&paths[p].length>0) {
      let cand = paths[p].pop();
      let cx = cand[3];
      let cy = cand[2];
      let cpath = cand[1];
      let cdist = cand[0];
      let dir = cpath.substr(-1);
      let dirL = -1;
      let k=0;
      for(k=0;k<maxD&&dirL<0;k++) {
        if(cpath.length-2-k<0) {
          dirL = cpath.length;
        } else if(cpath[cpath.length-2-k]!==dir) {
          dirL = k;
        }
      }
      if(dirL<0||dirL>maxD) {
        dirL=0;
      }
      switch(dir) {
        case 'R': dir = RI; break;
        case 'D': dir = DO; break;
        case 'L': dir = LE; break;
        case 'U': dir = UP; break;
      }

      if(cx===tarx&&cy===tary) {
        answer = cdist;
        done = true;
        console.log(`We solved it in ${cdist} with a path of ${cpath}`);
      } else if(cpath.length>0&&visit[dir][cy][cx][dirL]>0) {
        // already visited with this history for less than or equal price
      } else {
        expandR(cdist, cpath, cy, cx);
        expandD(cdist, cpath, cy, cx);
        expandL(cdist, cpath, cy, cx);
        expandU(cdist, cpath, cy, cx);
        if(cpath.length>0) {
          visit[dir][cy][cx][dirL]++;
        }
      }
    }
  }
  console.log(answer);
});

function expandR(d,p,y,x) {
  if(x===tarx||/RRR/.test(p.substr(-3))||/L/.test(p.substr(-1))) {
    return;
  }
  let newd = d + island[y][x+1];
  paths[newd+heur(y,x+1)].push([newd, p+"R", y, x+1]);
}

function expandD(d,p,y,x) {
  if(y===tary||/DDD/.test(p.substr(-3))||/U/.test(p.substr(-1))) {
    return;
  }
  let newd = d + island[y+1][x];
  paths[newd+heur(y+1,x)].push([newd, p+"D", y+1, x]);
}

function expandL(d,p,y,x) {
  if(x===0||/LLL/.test(p.substr(-3))||/R/.test(p.substr(-1))) {
    return;
  }
  let newd = d + island[y][x-1];
  paths[newd+heur(y,x-1)].push([newd, p+"L", y, x-1]);
}

function expandU(d,p,y,x) {
  if(y===0||/UUU/.test(p.substr(-3))||/D/.test(p.substr(-1))) {
    return;
  }
  let newd = d + island[y-1][x];
  paths[newd+heur(y-1,x)].push([newd, p+"U", y-1, x]);
}

function heur(y, x) {
  return (tary - y) + (tarx - x);
}

