export const KEY = 'ink-register-v1';
export const JOBS = [
  {name:'Night Ferry', subtitle:'BAY SERVICE / 06:40', ink:['#177e88','#e26b49'], offsets:[[18,-14,0],[-17,12,0]]},
  {name:'Peak Line', subtitle:'ALPINE RAIL / EST. 1936', ink:['#22786f','#d4823e'], offsets:[[-21,16,0],[19,-15,-7]]},
  {name:'After Hours', subtitle:'LIVE JAZZ / FRIDAY 22:00', ink:['#6953ad','#ec6954'], offsets:[[18,14,8],[-17,-12,-9]]},
  {name:'Greenhouse', subtitle:'GLASSHOUSE / BOTANICAL STUDIES', ink:['#42885b','#db8045','#7667ac'], offsets:[[-23,-10,10],[16,17,-11],[-12,20,6]]},
  {name:'Deep Current', subtitle:'OCEAN SURVEY / FIELD NOTES', ink:['#337aab','#e26854','#429a8a'], offsets:[[22,-21,-12],[-18,16,9],[20,13,-6]]},
  {name:'First Contact', subtitle:'OBSERVATORY / SIGNAL NO. 07', ink:['#6d5ba5','#e66d40','#329397'], offsets:[[-24,19,12],[20,-21,-13],[-17,-14,11]]}
];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const bounded = (value, limit) => Number.isFinite(value) ? clamp(value,-limit,limit) : 0;
export function profile(raw = {}) {
  return {
    done:JOBS.map((_,i)=>raw?.done?.[i]===true),
    rewards:{like:raw?.rewards?.like===true,comment:raw?.rewards?.comment===true},
    sound:raw?.sound!==false
  };
}
export function mergeProfile(local, remote) {
  const a=profile(local), b=profile(remote);
  return {...a,done:a.done.map((value,i)=>value||b.done[i]),
    rewards:{like:a.rewards.like||b.rewards.like,comment:a.rewards.comment||b.rewards.comment}};
}
export function unlocked(p, job) { return Number.isInteger(job)&&job>=0&&job<JOBS.length&&(job===0||p.done[job-1]); }
export function makeRun(job=0, layer=0) {
  const [x,y,angle]=JOBS[job].offsets[layer];
  return {job,layer,x,y,angle,guide:false,phase:'ready'};
}
export function restore(raw, p) {
  if (!raw || !unlocked(p,raw.job) || !Number.isInteger(raw.layer)) return makeRun();
  const count=JOBS[raw.job].ink.length;
  if(raw.phase==='won'&&raw.layer===count&&p.done[raw.job])
    return {...makeRun(raw.job),layer:count,x:0,y:0,angle:0,phase:'won'};
  if(raw.layer<0||raw.layer>=count||!['ready','active'].includes(raw.phase)) return makeRun(raw.job);
  if(![raw.x,raw.y,raw.angle].every(Number.isFinite)) return makeRun(raw.job,raw.layer);
  return {...makeRun(raw.job,raw.layer),x:bounded(raw.x,56),y:bounded(raw.y,56),angle:bounded(raw.angle,28),guide:raw.guide===true,phase:raw.phase};
}
export function aligned(run) { return run.phase!=='won' && Math.hypot(run.x,run.y)<=2.5 && Math.abs(run.angle)<=1.05; }
export function accuracy(run) { return run.phase==='won'||aligned(run) ? 100 : clamp(Math.round(100-Math.hypot(run.x,run.y)*1.1-Math.abs(run.angle)*1.9),0,99); }
export function adjust(run, x, y, angle, host) {
  if(run.phase==='won'||![x,y,angle].every(Number.isFinite)) return false;
  x=bounded(x,56); y=bounded(y,56); angle=bounded(angle,28);
  if(!JOBS[run.job].offsets[run.layer][2]) angle=0;
  if(run.x===x&&run.y===y&&run.angle===angle) return false;
  host?.start(); Object.assign(run,{x,y,angle,phase:'active'}); return true;
}
export function printLayer(run, p, host) {
  if(!aligned(run)) return null;
  host?.start();
  const layer=run.layer+1;
  if(layer<JOBS[run.job].ink.length) return {...makeRun(run.job,layer),phase:'active',guide:run.guide};
  p.done[run.job]=true;
  host?.end();
  return {...run,layer,x:0,y:0,angle:0,phase:'won'};
}
