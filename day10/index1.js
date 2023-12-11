const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let m = [];
let p = [];
let en = [];
eachLine(filename, function(line) {
  m.push(line.split(''));
  p.push(line.split('').map((c)=>0));
  en.push(line.split('').map((c)=>'.'));
}).then(function(err) {
  let y,x;
  let sx,sy;
  for(y=0;y<m.length;y++) {
    for(x=0;x<m[y].length;x++) {
      if(m[y][x]==='S') {
        sx=x;
        sy=y;
        p[sy][sx]=1;
      }
    }
  }
  let dir = [];
  let found = false;
  if(sy>0) {
    let t = m[sy-1][sx];
    if(t==='|'||t==='7'||t==='F') {
      dir = [-1, 0];
      found=true;
    }
  }
  if(!found && sy+1<m.length) {
    let t = m[sy+1][sx];
    if(t==='|'||t==='L'||t==='J') {
      dir = [1, 0];
      found=true;
    }
  }
  if(!found && sx>0) {
    let t = m[sy][sx-1];
    if(t==='-'||t==='J'||t==='7') {
      dir = [0, -1];
      found=true;
    }
  }
  let ny = sy + dir[0];
  let nx = sx + dir[1];
  for(answer++;m[ny][nx]!=='S';answer++) {
    p[ny][nx]=1;
    if(dir[0]===-1) {
      switch (m[ny][nx]) {
        case '|':
          dir = [-1, 0];
          ny = ny -1;
          break;
        case '7':
          dir = [0, -1];
          nx = nx - 1;
          break;
        case 'F':
          dir = [0, 1];
          nx = nx + 1;
          break;
        default:
          throw err;
          break;
      }
    } else if(dir[0]===1) {
      switch (m[ny][nx]) {
        case '|':
          dir = [1, 0];
          ny = ny + 1;
          break;
        case 'L':
          dir = [0, 1];
          nx = nx + 1;
          break;
        case 'J':
          dir = [0, -1];
          nx = nx - 1;
          break;
        default:
          throw err;
          break;
      }
    } else if(dir[1]===-1) {
      switch (m[ny][nx]) {
        case '-':
          dir = [0, -1];
          nx = nx - 1;
          break;
        case 'L':
          dir = [-1, 0];
          ny = ny - 1;
          break;
        case 'F':
          dir = [1, 0];
          ny = ny + 1;
          break;
        default:
          throw err;
          break;
      }
    } else {
      switch (m[ny][nx]) {
        case '-':
          dir = [0, 1];
          nx = nx + 1;
          break;
        case 'J':
          dir = [-1, 0];
          ny = ny - 1;
          break;
        case '7':
          dir = [1, 0];
          ny = ny + 1;
          break;
        default:
          throw err;
          break;
      }
    }
  }

  answer /= 2;
  console.log(answer);
  //console.log(p);
  for(let y=0;y<m.length;y++) {
    for(let x=0;x<m[y].length;x++) {
      if(p[y][x] === 1) {
        en[y][x] = '*';
      } else {
        let valid = true;
        let cross = 0;
        for(let tx=x;tx>=0;tx--) {
          if(p[y][tx]===1&&m[y][tx]!== '-'&&m[y][tx]!=='J'&&m[y][tx]!=='L') {
            cross++;
          }
        }
        if(cross%2 === 0) {
          valid = false;
        }
        cross = 0;
        for(let tx=x;tx<m[y].length;tx++) {
          if(p[y][tx]===1&&m[y][tx]!== '-'&&m[y][tx]!=='J'&&m[y][tx]!=='L') {
            cross++;
          }
        }
        if(cross%2 === 0) {
          valid = false;
        }
        cross = 0;
        for(let ty=y;ty>=0;ty--) {
          if(p[ty][x]===1&&m[ty][x]!== '|'&&m[ty][x]!=='J'&&m[ty][x]!=='7') {
            cross++;
          }
        }
        if(cross%2 === 0) {
          valid = false;
        }
        cross = 0;
        for(let ty=y;ty<m.length;ty++) {
          if(p[ty][x]===1&&m[ty][x]!== '|'&&m[ty][x]!=='J'&&m[ty][x]!=='7') {
            cross++;
          }
        }
        if(cross%2 === 0) {
          valid = false;
        }
        if(valid) {
          en[y][x] = 'I';
        } else {
          en[y][x] = 'O';
        }
      }
    }
  }
  //console.log(en);
  answer = en.map((a)=>a.filter((f)=>f==='I').length).reduce((a,b)=>a+b);
  console.log(answer);
});
