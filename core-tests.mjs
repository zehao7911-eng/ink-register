import assert from 'node:assert/strict';
import * as C from './core.mjs';
import {bridge} from './sdk.mjs';

let claims=0, starts=0, ends=0, off=0, like, comment, writes=[];
let injected, p=C.profile();
const startBridge=()=>bridge({
  host:()=>injected,read:()=>p,write:(value,merge)=>{p=merge?C.mergeProfile(p,value):C.profile(value);},
  changed:event=>{if(event.type==='reward')claims++;}
});
const settle=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
const fullHost={
  gameStart:()=>starts++,gameOver:()=>ends++,
  onLike:async callback=>{like=callback;return {code:0,data:{unsubscribe:()=>off++}};},
  onComment:async callback=>{comment=callback;return {code:0,data:{unsubscribe:()=>off++}};},
  loadUserGameState:async()=>({}),saveUserGameState:async value=>{writes.push(value);return {code:0};}
};
let sdk=startBridge(), run=C.makeRun();
assert.equal(C.printLayer(run,p,sdk),null);
assert.equal(C.adjust(run,17,-14,0,sdk),true);
injected={gameStart:fullHost.gameStart};sdk.connect();sdk.connect();
assert.equal(starts,1);
Object.assign(injected,fullHost);sdk.connect();await settle();
like({project_id:'press',status:false,count:4});
assert.equal(claims,0);
like({project_id:'press',status:true,count:0});like({project_id:'press',status:true,count:99});
comment({project_id:'press',content:'',count:0});comment({project_id:'press',content:'duplicate'});
await settle();assert.equal(claims,2);assert.equal(writes.at(-1).game,'ink-register');
assert.equal('run' in writes.at(-1),false);
C.adjust(run,0,0,0,sdk);run=C.printLayer(run,p,sdk);
assert.equal(run.layer,1);assert.equal(ends,0);
const saved=JSON.parse(JSON.stringify({profile:p,run}));
sdk.stop();assert.equal(off,2);
run=C.restore(saved.run,saved.profile);sdk=startBridge();await settle();
assert.equal(starts,1);assert.equal(run.layer,1);assert.equal(run.x,-17);
C.adjust(run,0,0,0,sdk);run=C.printLayer(run,p,sdk);sdk.save();await settle();
assert.equal(starts,2);assert.equal(ends,1);assert.equal(C.printLayer(run,p,sdk),null);
assert.equal(C.restore(run,p).phase,'won');assert.equal(C.unlocked(p,1),true);
sdk.stop();assert.equal(off,4);
let layers=0;
for(let j=0;j<C.JOBS.length;j++){
  assert(C.unlocked(p,j));let visit=C.makeRun(j);
  while(visit.phase!=='won'){
    assert(!C.aligned(visit));
    while(visit.x!==0)C.adjust(visit,Math.sign(visit.x)*Math.max(0,Math.abs(visit.x)-2),visit.y,visit.angle);
    while(visit.y!==0)C.adjust(visit,visit.x,Math.sign(visit.y)*Math.max(0,Math.abs(visit.y)-2),visit.angle);
    while(visit.angle!==0)C.adjust(visit,visit.x,visit.y,visit.angle-Math.sign(visit.angle));
    assert.equal(C.accuracy(visit),100);
    visit=C.printLayer(visit,p);layers++;
  }
}
assert.equal(layers,15);
let lateResolve;
injected={onLike:()=>new Promise(resolve=>lateResolve=resolve),onComment:async()=>{throw Error('registration failed');},gameStart:async()=>{throw Error('start failed');}};
sdk=startBridge();sdk.start();sdk.stop();lateResolve({code:0,data:{unsubscribe:()=>off++}});
await settle();assert.equal(off,5);
let expiredCallback, finishRegistration;
injected={onComment:cb=>{expiredCallback=cb;return new Promise(resolve=>finishRegistration=resolve);}};
sdk=bridge({host:()=>injected,read:()=>p,write:()=>assert.fail('Expired listener accepted'),timeout:8});
await new Promise(resolve=>setTimeout(resolve,20));
finishRegistration({code:0,data:{unsubscribe:()=>off++}});await settle();
assert.equal(off,6);expiredCallback({project_id:'test',content:''});sdk.stop();
let foreignWrites=0;
injected={loadUserGameState:async()=>({game:'other',v:1,profile:{}}),saveUserGameState:()=>foreignWrites++};
sdk=startBridge();await settle();sdk.save();await settle();assert.equal(foreignWrites,0);sdk.stop();
console.log('Six editions, 15 printable layers, exact mid-edition restore, lifecycle and host mocks passed.');
