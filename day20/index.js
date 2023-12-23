const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let modules = [];
let configs = {};

const NONE = 0;
const FL = 1;
const CONJ = 2;

const OFF = 0;
const ON = 1;

const LO = 0;
const HI = 1;

const PUSHES = 1000;

let pulses = [];

let buttons = [];

let loCt = 0;
let hiCt = 0;
let lct = 0;
let hct = 0;

eachLine(filename, function(line) {
  let config = line.split(' -> ');
  let module = config[0];
  let type = NONE;
  switch(module[0]) {
    case '%':
      type = FL;
      module = module.slice(1);
      break;
    case '&':
      type = CONJ;
      module = module.slice(1);
      break;
  }
  modules.push(module);
  configs[module] = [type, config[1].split(', '), OFF];
}).then(function(err) {
  for(let k=0; k<modules.length; k++) {
    let name = modules[k];
    if(configs[name][0]===CONJ) {
      let inputs = [];
      let values = [];
      for(let j=0; j<modules.length; j++) {
	let cname = modules[j];
	for(let i=0; i<configs[cname][1].length; i++) {
	  if(name===configs[cname][1][i]) {
	    inputs.push(cname);
	    values.push(LO);
	  }
	}
      }
      configs[name][2] = inputs;
      configs[name][3] = values;
    }
  }

  console.log(modules);
  console.log(configs);
  console.log(captureState());
  buttons.push([captureState(), [0, 0], [0, 0]]);
  let loop = false;
  let loopLo = 0;
  let loopHi = 0;
  for(let b=0; !loop && b<PUSHES; b++) {
    lct = 0;
    hct = 0;
    pulses.push(['button', LO, 'broadcaster']);
    while(pulses.length>0) {
      let p = pulses.shift();
      handlePulse(p);
    }
    loCt += lct;
    hiCt += hct;
    buttons.push([captureState(), [lct, hct], [loCt, hiCt]]);
    for(let k=0; !loop&&k<buttons.length-1;k++) {
      if(buttons[k][0]===buttons[buttons.length-1][0]) {
	loopLo = k;
	loopHi = buttons.length-1;
	loop=true;
	console.log(`Found a loop between ${loopLo} and ${loopHi}`);
      }
    }
  }
  console.log(buttons);
  if(loop) {
    let pro = loopLo;
    let proLo = 0;
    let proHi = 0;
    if(loopLo>0) {
      proLo = buttons[loopLo-1][2][0];
      proHi = buttons[loopLo-1][2][1];
    }
    let loops = (PUSHES-pro)/(loopHi-loopLo);
    let perLoopLo = 0;
    let perLoopHi = 0;
    for(let k=loopLo;k<=loopHi;k++) {
      perLoopLo += buttons[k][1][0];
      perLoopHi += buttons[k][1][1];
    }
    let rem = (PUSHES-pro)%(loopHi-loopLo);
    let remLo = 0;
    let remHi = 0;
    for(let k=loopLo;k<rem;k++) {
      remLo += buttons[k][1][0];
      remHi += buttons[k][1][1];
    }
    loCt = proLo + loops*perLoopLo + remLo;
    hiCt = proHi + loops*perLoopHi + remHi;
    console.log(`With loop between ${loopLo} and ${loopHi} we know we need ${loops} of size ${loopHi-loopLo} in order to hit ${PUSHES} with [${proLo},${proHi}] from the before loop and [${perLoopLo},${perLoopHi}] per loop and then [${remLo},${remHi}] remaining`);
  }
  answer = loCt * hiCt;
  console.log(answer);
});

function handlePulse(p) {
  console.log(`${p[0]} ${(p[1]===LO)?'-low':'-high'}-> ${p[2]}`);
  (p[1]===LO) ? lct++ : hct++;
  if(modules.filter((f)=>f===p[2]).length===0) {
    return;
  }
  switch(configs[p[2]][0]) {
    case NONE:
      for(let k=0; k<configs[p[2]][1].length; k++) {
	pulses.push([p[2], p[1], configs[p[2]][1][k]]);
      }
      break;
    case FL:
      if(p[1]===LO) {
	if(configs[p[2]][2]===OFF) {
	  configs[p[2]][2] = ON;
	  for(let k=0; k<configs[p[2]][1].length; k++) {
	    pulses.push([p[2], HI, configs[p[2]][1][k]]);
	  }
	} else {
	  configs[p[2]][2] = OFF;
	  for(let k=0; k<configs[p[2]][1].length; k++) {
	    pulses.push([p[2], LO, configs[p[2]][1][k]]);
	  }
	}
      }
      break;
    case CONJ:
      for(let k=0; k<configs[p[2]][2].length; k++) {
	if(p[0]===configs[p[2]][2][k]) {
	  configs[p[2]][3][k] = p[1];
	}
      }
      let send = HI;
      if(configs[p[2]][2].length === configs[p[2]][3].filter((f)=>f===HI).length) {
	send = LO;
      }
      for(let k=0; k<configs[p[2]][1].length; k++) {
	pulses.push([p[2], send, configs[p[2]][1][k]]);
      }
      break;
  }
}

function captureState() {
  let ret = "";
  for(let k=0; k<modules.length; k++) {
    switch(configs[modules[k]][0]) {
      case FL:
	ret += ((configs[modules[k]][2]===OFF)?'0':'1');
	break;
      case CONJ:
	let st = "1";
	for(let j=0; j<configs[modules[k]][3].length; j++) {
	  if(configs[modules[k]][3][j]===LO) {
	    st="0";
	  }
	}
	ret += st;
	break;
    }
  }
  return ret;
}
