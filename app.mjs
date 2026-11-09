import * as C from './core.mjs';
import {Press} from './art.mjs';
import {bridge} from './sdk.mjs';

const byId=id=>document.getElementById(id);
let saved;
try{saved=JSON.parse(localStorage.getItem(C.KEY)||'null');}catch{}
let profile=C.profile(saved?.profile), run=C.restore(saved?.run,profile);
let host, drag=null, printing=false, lastMark=-1, audio;
const canvas=byId('press'), press=new Press(canvas), archive=byId('library');
const printButton=byId('print'), moves=[...document.querySelectorAll('[data-move]')];
const step={left:[-2,0,0],right:[2,0,0],up:[0,-2,0],down:[0,2,0],ccw:[0,0,-1],cw:[0,0,1]};

function save(cloud=false){
  try{localStorage.setItem(C.KEY,JSON.stringify({profile,run}));}catch{}
  if(cloud)host?.save();
}
function connect(){
  host=bridge({
    read:()=>C.profile(profile),
    write:(incoming,merge)=>{
      profile=merge?C.mergeProfile(profile,incoming):C.profile(incoming);
      save();refresh();if(archive.open)renderArchive();
    },
    changed:event=>{
      if(event.type==='support'&&archive.open)renderArchive();
      if(event.type==='reward')byId('notice').textContent=event.kind==='like'?'Brass rails unlocked':'Ink confetti unlocked';
    }
  });
}
function sound(notes){
  if(!profile.sound)return;
  try{
    audio??=new (window.AudioContext||window.webkitAudioContext)();
    audio.resume().catch(()=>{});
    for(const [i,frequency] of notes.entries()){
      const oscillator=audio.createOscillator(), gain=audio.createGain(), time=audio.currentTime+i*.065;
      oscillator.type='sine';oscillator.frequency.value=frequency;
      gain.gain.setValueAtTime(.085,time);gain.gain.exponentialRampToValueAtTime(.001,time+.14);
      oscillator.connect(gain).connect(audio.destination);oscillator.start(time);oscillator.stop(time+.15);
    }
  }catch{}
}
function refresh(draw=true){
  const job=C.JOBS[run.job], won=run.phase==='won', ready=C.aligned(run), count=profile.done.filter(Boolean).length;
  byId('edition').textContent='EDITION '+String(run.job+1).padStart(2,'0')+' / 06';
  byId('job').textContent=job.name;
  byId('film').textContent=won?'SIGNED & PRINTED':'FILM '+(run.layer+1)+' / '+job.ink.length;
  byId('accuracy').textContent=C.accuracy(run)+'%';
  byId('count').textContent=count+' / 6 EDITIONS PRINTED';
  byId('sound').textContent=profile.sound?'Sound on':'Sound off';
  byId('guide').setAttribute('aria-pressed',String(run.guide));
  byId('guide').disabled=printing||won;
  byId('reset').disabled=printing;byId('archive').disabled=printing;
  printButton.disabled=printing||(!won&&!ready);
  printButton.textContent=printing?'Printing…':won?(run.job<C.JOBS.length-1?'Next edition':'Print archive'):'Pull print';
  for(const button of moves)button.disabled=printing||won||(button.dataset.move.startsWith('c')&&!job.offsets[run.layer]?.[2]);
  const instruction=ready?'Marks registered. Pull the print.':job.offsets[run.layer]?.[2]?'Drag to shift. Use ↶ / ↷ to turn the film.':'Drag the film until the crosshairs overlap.';
  let tip=instruction;
  if(run.guide&&!ready&&!won){
    const direction=[Math.abs(run.x)>1?'←→ '+Math.abs(run.x).toFixed(1)+' '+(run.x>0?'left':'right'):'',Math.abs(run.y)>1?'↑↓ '+Math.abs(run.y).toFixed(1)+' '+(run.y>0?'up':'down'):'',Math.abs(run.angle)>1?Math.abs(run.angle).toFixed(1)+'° '+(run.angle>0?'↶':'↷'):''].filter(Boolean);
    if(direction.length)tip=direction.join('  ·  ');
  }
  byId('tip').textContent=won?'Edition complete. Find your finished prints in the archive.':tip;
  document.body.classList.toggle('brass',profile.rewards.like||count>=3);
  if(draw&&!printing)press.draw(run,profile);
}
function change(x,y,angle){
  if(printing||archive.open)return;
  const before=C.aligned(run);
  if(!C.adjust(run,x,y,angle,host))return;
  save();refresh();
  if(C.aligned(run)&&!before){sound([740,990]);byId('notice').textContent='REGISTERED';}
  else if(!C.aligned(run)){byId('notice').textContent='';const mark=Math.floor(C.accuracy(run)/10);if(mark>lastMark&&mark>=8)sound([440+mark*20]);lastMark=mark;}
}
function nudge(action){const delta=step[action];if(delta)change(run.x+delta[0],run.y+delta[1],run.angle+delta[2]);}
function selectJob(job, preview=false){
  if(printing||!C.unlocked(profile,job))return;
  host?.end();host?.prepare();run=C.makeRun(job);
  if(preview&&profile.done[job]){
    run={...run,layer:C.JOBS[job].ink.length,x:0,y:0,angle:0,phase:'won'};
  }
  lastMark=-1;byId('notice').textContent='';save();refresh();
}
function renderArchive(){
  const list=byId('editions');list.replaceChildren();
  C.JOBS.forEach((job,i)=>{
    const button=document.createElement('button'), label=document.createElement('small');
    label.textContent=profile.done[i]?'PRINTED':C.unlocked(profile,i)?'AVAILABLE':'LOCKED';
    button.append(label,job.name);button.disabled=!C.unlocked(profile,i);
    button.onclick=()=>{archive.close();if(i!==run.job)selectJob(i,true);};list.append(button);
  });
  const support=host?.support()||{};
  const perks=[];
  if(support.like)perks.push(profile.rewards.like?'Brass rails unlocked.':'Optional: like this game in GameWave for brass rails. Also earned after 3 editions.');
  if(support.comment)perks.push(profile.rewards.comment?'Ink confetti unlocked.':'Optional: leave a direct GameWave comment for ink confetti. Also earned after 6 editions.');
  const rewards=byId('hostRewards');rewards.hidden=!perks.length;rewards.textContent=perks.join(' ');
}
function showArchive(){if(!printing&&!archive.open){renderArchive();archive.showModal();}}
function pull(){
  if(printing)return;
  if(run.phase==='won'){
    if(run.job<C.JOBS.length-1)selectJob(run.job+1);else showArchive();
    return;
  }
  const result=C.printLayer(run,profile,host);
  if(!result)return;
  const printed={...result,layer:run.layer+1,phase:'won'};
  run=result;printing=true;drag=null;save(true);refresh(false);
  sound(run.phase==='won'?[392,523,659,784]:[294,440,587]);
  const start=performance.now();
  const animate=now=>{
    const progress=Math.min(1,(now-start)/430);
    if(progress<1){press.draw(printed,profile,Math.max(.001,progress));requestAnimationFrame(animate);}
    else{printing=false;byId('notice').textContent=run.phase==='won'?'EDITION PRINTED':'LAYER PRINTED';refresh();}
  };
  requestAnimationFrame(animate);
}
canvas.addEventListener('pointerdown',event=>{
  if(printing||run.phase==='won'||drag||event.button!==0)return;
  const box=canvas.getBoundingClientRect();
  drag={id:event.pointerId,clientX:event.clientX,clientY:event.clientY,x:run.x,y:run.y,angle:run.angle,scaleX:560/box.width,scaleY:530/box.height};
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove',event=>{
  if(drag?.id!==event.pointerId)return;
  change(drag.x+(event.clientX-drag.clientX)*drag.scaleX,drag.y+(event.clientY-drag.clientY)*drag.scaleY,drag.angle);
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{if(drag?.id===e.pointerId)drag=null;});
moves.forEach(button=>button.onclick=()=>nudge(button.dataset.move));
printButton.onclick=pull;
byId('guide').onclick=()=>{run.guide=!run.guide;save();refresh();};
byId('sound').onclick=()=>{profile.sound=!profile.sound;save();refresh();if(profile.sound)sound([440]);};
byId('reset').onclick=()=>selectJob(run.job);
byId('archive').onclick=showArchive;byId('closeArchive').onclick=()=>archive.close();
addEventListener('keydown',event=>{
  if(archive.open||event.altKey||event.ctrlKey||event.metaKey||printing)return;
  const action={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',q:'ccw',e:'cw'}[event.key];
  if(action){event.preventDefault();nudge(action);}
});
addEventListener('pagehide',()=>{save();host?.stop();});
addEventListener('pageshow',event=>{if(event.persisted)connect();});
connect();refresh();
