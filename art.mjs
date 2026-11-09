import {JOBS} from './core.mjs';

const ellipse=(c,x,y,rx,ry)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
const polygon=(c,points)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const line=(c,points,width=1)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineWidth=width;c.stroke();};
function ring(c,x,y,r,width){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.lineWidth=width;c.stroke();}
function cross(c,x,y){line(c,[[x-11,y],[x+11,y]],1.8);line(c,[[x,y-11],[x,y+11]],1.8);ring(c,x,y,5,1);}
const marks=[[-151,-194],[151,-194],[-151,194],[151,194]];

function ferry(c,i){
  if(i===0){
    polygon(c,[[-135,56],[131,56],[104,98],[-100,98]]);
    c.fillRect(-93,18,164,38);c.fillRect(-38,-12,75,30);
    polygon(c,[[-49,-12],[46,-12],[29,-22],[-32,-22]]);
    for(let y=112;y<158;y+=12){
      c.beginPath();c.moveTo(-142,y);
      for(let x=-142;x<142;x+=35)c.quadraticCurveTo(x+17,y-8,x+35,y);
      c.lineWidth=2;c.stroke();
    }
    line(c,[[-80,15],[-80,-31],[-64,-22]],2);
    line(c,[[-32,-25],[-12,-40],[7,-25]],1.5);
    line(c,[[-114,54],[-114,36],[-95,36]],2);
    c.save();c.globalCompositeOperation='destination-out';
    line(c,[[-119,62],[117,62]],1.4);
    for(const x of [-25,-3,19])c.fillRect(x,-3,13,12);
    line(c,[[-86,94],[88,94]],1);c.restore();
  }else{
    ellipse(c,54,-53,56,56);c.fillRect(-16,-41,18,25);
    for(let x=-76;x<64;x+=24)c.fillRect(x,29,13,11);
    for(let x=-86;x<96;x+=31)ellipse(c,x,74,3,3);
    line(c,[[-113,108],[-52,108]],2);line(c,[[51,108],[118,108]],2);
    for(const [x,y] of [[-97,-68],[-70,-84],[-42,-61]]){
      c.beginPath();c.moveTo(x-8,y);c.quadraticCurveTo(x-3,y-5,x,y);
      c.quadraticCurveTo(x+4,y-5,x+8,y);c.lineWidth=1.5;c.stroke();
    }
  }
}
function peaks(c,i){
  if(i===0){
    polygon(c,[[-143,65],[-75,-49],[-38,-12],[15,-104],[112,30],[143,13],[143,156],[-143,156]]);
    c.save();c.globalCompositeOperation='destination-out';
    polygon(c,[[-12,-58],[15,-104],[47,-55],[24,-62],[15,-50],[4,-67]]);c.restore();
  }else{
    ellipse(c,-71,-64,37,37);
    polygon(c,[[-130,110],[-83,68],[10,68],[47,90],[47,113]]);
    c.fillRect(-80,59,87,7);c.fillRect(54,92,73,21);
    for(let x=-103;x<126;x+=22)ellipse(c,x,119,6,6);
    line(c,[[-141,132],[141,132]],3);line(c,[[-141,142],[141,142]],1);
  }
}
function jazz(c,i){
  if(i===0){
    ellipse(c,6,29,100,100);
    c.save();c.globalCompositeOperation='destination-out';ring(c,6,29,82,2);ring(c,6,29,71,2);ring(c,6,29,59,2);ellipse(c,6,29,26,26);c.restore();
    for(let x=-137;x<-84;x+=16)line(c,[[x,153],[x,117-(x+137)/2]],4);
    for(let x=104;x<144;x+=13)line(c,[[x,-90],[x,-50-(x-104)]],3);
  }else{
    c.beginPath();c.moveTo(-99,83);c.bezierCurveTo(-56,127,-13,105,-7,56);
    c.lineTo(5,-39);c.quadraticCurveTo(12,-78,58,-63);
    c.lineTo(61,-49);c.quadraticCurveTo(25,-60,22,-32);
    c.lineTo(15,70);c.bezierCurveTo(3,130,-53,150,-110,109);c.closePath();c.fill();
    ellipse(c,-108,93,25,14);ellipse(c,6,29,18,18);
    for(let y=-16;y<57;y+=20)ellipse(c,23,y,5,5);
    for(const [x,y] of [[99,107],[-104,-56],[111,-28]]){line(c,[[x-12,y],[x+12,y]],2);line(c,[[x,y-12],[x,y+12]],2);}
  }
}
function garden(c,i){
  if(i===0){
    line(c,[[-124,146],[-124,-25],[0,-104],[124,-25],[124,146],[-124,146]],3);
    line(c,[[-124,-25],[124,-25]],2);line(c,[[0,-104],[0,146]],2);
    for(const x of [-75,75])line(c,[[x,-25],[x,146]],1);
    for(const [x,y,s] of [[-78,95,-1],[-37,65,1],[34,55,-1],[80,83,1]]){
      line(c,[[x,130],[x,y-23]],3);c.save();c.translate(x+s*11,y);c.rotate(s*.65);ellipse(c,0,0,19,9);c.restore();
    }
  }else if(i===1){
    for(const x of [-78,-37,34,80])polygon(c,[[x-15,117],[x+15,117],[x+10,141],[x-10,141]]);
    for(const [x,y] of [[-77,63],[35,23]])for(let j=0;j<6;j++)ellipse(c,x+Math.cos(j)*10,y+Math.sin(j)*10,7,7);
  }else{
    for(const [x,y] of [[-37,42],[81,51]])for(let j=0;j<5;j++)ellipse(c,x+Math.cos(j*1.257)*9,y+Math.sin(j*1.257)*9,7,7);
    ring(c,0,-53,18,2);line(c,[[-105,152],[105,152]],2);
  }
}
function ocean(c,i){
  if(i===0){
    c.beginPath();c.moveTo(-110,41);c.bezierCurveTo(-63,-37,48,-63,107,15);c.quadraticCurveTo(136,41,96,73);c.bezierCurveTo(24,116,-53,97,-105,65);c.lineTo(-139,91);c.lineTo(-132,38);c.closePath();c.fill();
    polygon(c,[[-3,87],[44,124],[49,87]]);
  }else if(i===1){
    ellipse(c,66,35,9,9);
    for(const [x,y] of [[-109,-42],[117,-34],[101,129],[-88,116]]){ring(c,x,y,8,2);ring(c,x+12,y-13,3,1);}
    line(c,[[71,63],[91,59]],2);
  }else{
    for(let y=-64;y<157;y+=27){
      c.beginPath();c.moveTo(-143,y);c.bezierCurveTo(-62,y+16,50,y-18,143,y+3);c.lineWidth=1.5;c.stroke();
    }
  }
}
function signal(c,i){
  if(i===0){
    ellipse(c,19,-31,54,54);polygon(c,[[-142,146],[-90,74],[-55,109],[26,46],[92,103],[143,85],[143,156],[-142,156]]);
  }else if(i===1){
    c.save();c.translate(-48,27);c.rotate(-.7);
    c.beginPath();c.ellipse(0,0,47,32,0,0,Math.PI);c.closePath();c.fill();
    line(c,[[0,18],[0,-21],[15,-37]],3);ellipse(c,15,-37,4,4);c.restore();
    line(c,[[-46,53],[-66,110],[-14,110],[-41,54]],5);
  }else{
    c.save();c.translate(19,-31);c.rotate(-.36);c.beginPath();c.ellipse(0,0,98,24,0,0,Math.PI*2);c.lineWidth=3;c.stroke();c.restore();
    for(const [x,y] of [[-113,-54],[-54,-88],[107,-84],[120,30],[-115,12]]){line(c,[[x-5,y],[x+5,y]],2);line(c,[[x,y-5],[x,y+5]],2);}
  }
}
const illustrations=[ferry,peaks,jazz,garden,ocean,signal];

export class Press {
  constructor(canvas){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.films=new Map();
    this.texture=document.createElement('canvas');this.texture.width=128;this.texture.height=128;
    const g=this.texture.getContext('2d');
    for(let i=0;i<1800;i++){g.fillStyle=i%2?'#fcf1c20e':'#302c1b0e';g.fillRect((i*47+i*i)%128,(i*71+i*i*3)%128,1+(i%3===0),1);}
  }
  film(job,index){
    const key=job*4+index;
    if(!this.films.has(key)){
      const surface=document.createElement('canvas');surface.width=330;surface.height=348;
      const g=surface.getContext('2d');g.translate(165,174);g.fillStyle=g.strokeStyle=JOBS[job].ink[index];
      illustrations[job](g,index);this.films.set(key,surface);
    }
    return this.films.get(key);
  }
  draw(run,p,effect=0){
    const c=this.ctx, job=JOBS[run.job];
    c.setTransform(1,0,0,1,0,0);c.fillStyle='#263a30';c.fillRect(0,0,560,530);
    const deck=c.createLinearGradient(0,0,0,530);deck.addColorStop(0,'#3f5646');deck.addColorStop(1,'#21332c');
    c.fillStyle=deck;c.fillRect(12,30,536,479);
    c.fillStyle=c.createPattern(this.texture,'repeat');c.fillRect(0,0,560,530);
    const brass=p.rewards.like||p.done.filter(Boolean).length>=3;
    c.fillStyle=brass?'#bd9861':'#728375';c.fillRect(43,55,13,423);c.fillRect(504,55,13,423);
    for(let y=64;y<479;y+=13){c.fillStyle='#233a30';c.fillRect(46,y,y%5===0?9:5,1);c.fillRect(506,y,6,1);}
    for(const x of [23,537])for(const y of [45,495]){c.fillStyle='#9da887';ellipse(c,x,y,5,5);c.strokeStyle='#29382e';line(c,[[x-3,y+2],[x+3,y-2]],1);}
    c.save();c.translate(280,268);
    c.shadowColor='#0c1c17a0';c.shadowBlur=15;c.shadowOffsetY=7;c.fillStyle='#f1e4bf';c.fillRect(-174,-213,348,426);c.shadowColor='transparent';
    c.fillStyle=c.createPattern(this.texture,'repeat');c.fillRect(-174,-213,348,426);
    c.strokeStyle='#9a856556';c.strokeRect(-160,-202,320,404);
    c.textAlign='center';c.fillStyle='#334238';c.font='700 10px monospace';c.fillText(job.subtitle,0,-169);
    c.font='bold 33px Georgia';c.fillText(job.name.toUpperCase(),0,-133);
    c.font='700 9px monospace';c.fillText('ORIGINAL EDITION / POCKET PRINT SHOP',0,185);
    if(run.guide&&run.phase!=='won'){
      c.globalAlpha=.17;c.drawImage(this.film(run.job,run.layer),-165,-157);c.globalAlpha=1;
    }
    c.globalCompositeOperation='multiply';
    for(let index=0;index<run.layer;index++)c.drawImage(this.film(run.job,index),-165,-157);
    c.globalCompositeOperation='source-over';
    if(run.phase!=='won'){
      c.strokeStyle='#283b30';for(const [x,y] of marks)cross(c,x,y);
      c.save();c.translate(run.x,run.y);c.rotate(run.angle*Math.PI/180);
      c.fillStyle=job.ink[run.layer]+'10';c.fillRect(-164,-205,328,410);
      c.strokeStyle=job.ink[run.layer];c.lineWidth=1.4;c.setLineDash([4,5]);c.strokeRect(-164,-205,328,410);c.setLineDash([]);
      c.globalCompositeOperation='multiply';c.globalAlpha=.79;c.drawImage(this.film(run.job,run.layer),-165,-157);
      c.globalAlpha=1;c.globalCompositeOperation='source-over';
      for(const [x,y] of marks)cross(c,x,y);
      c.restore();
    }else{
      c.fillStyle='#a4513c';c.font='800 9px monospace';c.textAlign='right';c.fillText('REGISTERED',151,195);
    }
    if(effect>0){
      const y=202-404*effect;
      const roller=c.createLinearGradient(0,y-14,0,y+14);roller.addColorStop(0,'#a5825d');roller.addColorStop(.45,'#f0c393');roller.addColorStop(1,'#624e42');
      c.fillStyle=roller;c.fillRect(-183,y-11,366,22);
      c.fillStyle='#3b4b40';c.fillRect(-193,y-4,386,8);
      if(p.rewards.comment||p.done.filter(Boolean).length===6){
        for(let i=0;i<20;i++){c.fillStyle=job.ink[i%job.ink.length];ellipse(c,Math.sin(i*2.4)*(183+16*(1-effect)),y+Math.cos(i*3.5)*25,3,2);}
      }
    }
    c.restore();
  }
}

