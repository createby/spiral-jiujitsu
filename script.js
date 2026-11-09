
const story=document.getElementById('story'), video=document.getElementById('heroMotion');
const poses=[...document.querySelectorAll('.pose')], stageText=document.getElementById('stageText');
const states=[
 {word:'STRIVE',kicker:'도전의 시작',title:'YOUR JOURNEY<br>STARTS HERE.'},
 {word:'PROGRESS',kicker:'성장하는 과정 · 사용자와 컴바치',title:'KEEP<br>MOVING.'},
 {word:'RESPECT',kicker:'서로를 존중하는 마음',title:'READY<br>TO ROLL.'}
];
let stage=0,locked=false,releaseTimer=0,touchStart=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const viewport=()=>window.innerHeight;
function positionFor(i){return story.getBoundingClientRect().top+scrollY + i*viewport()}
function setStage(i,animate=true){
 stage=clamp(i,0,2);const s=states[stage];
 stageText.textContent=s.word;
 document.getElementById('stageNumber').textContent=`0${stage+1} — 03`;
 document.getElementById('stageKicker').textContent=s.kicker;
 document.getElementById('stageTitle').innerHTML=s.title;
 document.getElementById('progressFill').style.width=`${(stage+1)/3*100}%`;
 poses.forEach((p,n)=>p.classList.toggle('active',n===stage));
 document.querySelector('.sticky-stage').dataset.stage=stage;
 if(video.readyState>=1 && Number.isFinite(video.duration)){
   video.pause();
   const targets=[.08,.49,.91];
   try{video.currentTime=Math.max(0,Math.min(video.duration-.05,video.duration*targets[stage]))}catch(e){}
 }
 if(animate)window.scrollTo({top:positionFor(stage),behavior:reduced?'instant':'smooth'});
}
function inHero(){const r=story.getBoundingClientRect();return r.top<=2&&r.bottom>viewport()+2}
function navigate(direction){
 if(locked)return;
 if(direction>0 && stage===2){
   locked=true;document.getElementById('about').scrollIntoView({behavior:reduced?'instant':'smooth'});
 }else if(direction<0 && stage===0){
   return;
 }else{
   locked=true;setStage(stage+(direction>0?1:-1));
 }
 clearTimeout(releaseTimer);releaseTimer=setTimeout(()=>locked=false,reduced?180:850);
}
window.addEventListener('wheel',e=>{
 if(!inHero()||Math.abs(e.deltaY)<5)return;
 e.preventDefault();
 navigate(e.deltaY>0?1:-1);
},{passive:false});
window.addEventListener('touchstart',e=>{if(inHero())touchStart=e.touches[0].clientY},{passive:true});
window.addEventListener('touchmove',e=>{if(touchStart!==null&&inHero())e.preventDefault()},{passive:false});
window.addEventListener('touchend',e=>{
 if(touchStart===null)return;
 const delta=touchStart-e.changedTouches[0].clientY;touchStart=null;
 if(Math.abs(delta)>35&&inHero())navigate(delta>0?1:-1);
},{passive:true});
window.addEventListener('keydown',e=>{
 if(!inHero()||!['ArrowDown','ArrowUp','PageDown','PageUp',' '].includes(e.key))return;
 e.preventDefault();navigate(['ArrowUp','PageUp'].includes(e.key)?-1:1);
});
window.addEventListener('scroll',()=>{
 if(locked)return;
 const r=story.getBoundingClientRect(), v=viewport();
 if(r.top<=0&&r.bottom>v){
  const nearest=clamp(Math.round(-r.top/v),0,2);
  if(nearest!==stage)setStage(nearest,false);
 }
},{passive:true});
video.addEventListener('loadedmetadata',()=>setStage(stage,false));
video.addEventListener('error',()=>document.querySelector('.sticky-stage').classList.remove('video-ready'));
video.addEventListener('loadeddata',()=>{document.querySelector('.sticky-stage').classList.add('video-ready');setStage(stage,false)});
setStage(0,false);
document.getElementById('copyAddress').addEventListener('click',async()=>{
 const address='서울특별시 성북구 돌곶이로 225 지하 1층';
 try{await navigator.clipboard.writeText(address);document.getElementById('copyStatus').textContent='주소가 복사되었습니다.'}
 catch{document.getElementById('copyStatus').textContent=address}
});
