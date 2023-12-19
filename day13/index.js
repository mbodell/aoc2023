const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let frames = [];
let nums = [];
let ans = [];
let next = [];

function findMirrors(arr) {
  let ret = [];
  for(let k=1;k<arr.length;k++) {
    let valid = true;
    let i =0;
    for(i=0;valid&&(k-i-1)>=0&&(k+i)<arr.length;i++) {
      if(arr[k-i-1]!==arr[k+i]) {
        valid = false;
      }
    }
    if(valid) {
      ret.push(k);
      //console.log(`for ${arr} we are pushing ${k} with ${i}`);
    }
  }
  return ret;
}

eachLine(filename, function(line) {
  if(line.length>0) {
    next.push(line.split(''));
  } else {
    frames.push(next);
    next = new Array();
  }
}).then(function(err) {
  frames.push(next);
  //console.log(frames);
  for(let k=0;k<frames.length;k++) {
    let vert = [];
    let hor = [];
    for(let h=0;h<frames[k].length;h++) {
      vert.push(frames[k][h].map((m)=>(('#'===m)?1:0)).reduce((a,b)=>2*a+b));
    }
    for(let v=0;v<frames[k][0].length;v++) {
      let str = "";
      for(let h=0;h<frames[k].length;h++) {
        str += frames[k][h][v];
      }
      hor.push(str.split('').map((m)=>(('#'===m)?1:0)).reduce((a,b)=>2*a+b));
    }
    nums.push([hor,vert]);
  }
  //console.log(nums);
  for(let f=0;f<nums.length;f++) {
    let num = 0;
    let h = findMirrors(nums[f][0]);
    let v = findMirrors(nums[f][1]);
    if(h.length) {
      num += h.reduce((a,b)=>a+b);
    }
    if(v.length) {
      num += 100* v.reduce((a,b)=>a+b);
    }
    //console.log(`Mirror ${f} has horizontal ${h} and vertical ${v} for ${num}`);
    ans.push(num);
  }
  answer = ans.reduce((a,b)=>a+b);
  console.log(answer);
});
