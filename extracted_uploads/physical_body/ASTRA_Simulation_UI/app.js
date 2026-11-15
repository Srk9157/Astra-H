const $ = (id) => document.getElementById(id);
let running = true;
let tick = 0;
let missionSeconds = 18 * 3600 + 42 * 60 + 16;
let alertMode = false;
const series = {
  heart: {canvas:$('heartChart'), values:[], color:'#4dd9ec'},
  spo: {canvas:$('spoChart'), values:[], color:'#a78bfa'},
  temp: {canvas:$('tempChart'), values:[], color:'#ffc66e'},
  resp: {canvas:$('respChart'), values:[], color:'#51e0ad'}
};
Object.values(series).forEach(s => { for(let i=0;i<45;i++) s.values.push(Math.random()*0.5+0.25); });

function drawLine(canvas, values, color, glow=false){
  const rect=canvas.getBoundingClientRect(), dpr=window.devicePixelRatio||1;
  if(!rect.width || !rect.height) return;
  canvas.width=Math.round(rect.width*dpr); canvas.height=Math.round(rect.height*dpr);
  const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
  const w=rect.width,h=rect.height;
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle='rgba(100,160,190,.10)';ctx.lineWidth=1;
  for(let x=0;x<w;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
  ctx.beginPath();
  values.forEach((v,i)=>{const x=i/(values.length-1)*w,y=h-(v*.78+.1)*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
  ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.shadowColor=glow?color:'transparent';ctx.shadowBlur=glow?8:0;ctx.stroke();ctx.shadowBlur=0;
}
function drawECG(){
  const c=$('ecgChart'),r=c.getBoundingClientRect(),d=window.devicePixelRatio||1;
  if(!r.width||!r.height)return;c.width=r.width*d;c.height=r.height*d;
  const x=c.getContext('2d');x.scale(d,d);const w=r.width,h=r.height;
  x.clearRect(0,0,w,h);x.strokeStyle='rgba(64,160,180,.12)';x.lineWidth=1;
  for(let gx=0;gx<w;gx+=18){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,h);x.stroke()}
  x.beginPath();let offset=(tick*2)%120;
  for(let px=0;px<w;px++){let p=((px+offset)%120)/120;let y=h*.52;
    if(p>.22&&p<.28)y-=Math.sin((p-.22)/.06*Math.PI)*5;
    if(p>.42&&p<.45)y+=Math.sin((p-.42)/.03*Math.PI)*5;
    if(p>.45&&p<.49)y-=Math.sin((p-.45)/.04*Math.PI)*h*.42;
    if(p>.49&&p<.53)y+=Math.sin((p-.49)/.04*Math.PI)*h*.28;
    if(p>.70&&p<.82)y-=Math.sin((p-.70)/.12*Math.PI)*4;
    px?x.lineTo(px,y):x.moveTo(px,y);
  }
  x.strokeStyle='#51e0ad';x.lineWidth=1.5;x.shadowColor='#51e0ad';x.shadowBlur=7;x.stroke();x.shadowBlur=0;
}
function update(){
  if(!running)return;
  tick++;
  const jitter=(n,spread)=>Math.round(n+(Math.random()-.5)*spread);
  const hr=alertMode?jitter(112,8):jitter(72,5);
  const spo=alertMode?jitter(91,3):jitter(98,1);
  const temp=alertMode?(36.8+Math.random()*.8):(36.7+Math.random()*.2);
  const rr=alertMode?jitter(25,4):jitter(16,2);
  $('heartRate').textContent=hr;$('spo2').textContent=spo;$('temperature').textContent=temp.toFixed(1);$('respRate').textContent=rr;
  const normalized={heart:hr/130,spo:spo/105,temp:(temp-35.5)/3,resp:rr/32};
  Object.entries(series).forEach(([key,s])=>{s.values.push(Math.max(.08,Math.min(.95,normalized[key]+(Math.random()-.5)*.09)));s.values.shift();drawLine(s.canvas,s.values,s.color,key==='heart')});
  drawECG();
  $('lastSync').textContent='Just now';
  if(tick%5===0){missionSeconds++;const hh=String(Math.floor(missionSeconds/3600)).padStart(2,'0'),mm=String(Math.floor(missionSeconds%3600/60)).padStart(2,'0'),ss=String(missionSeconds%60).padStart(2,'0');$('missionClock').textContent=`00:${hh}:${mm}:${ss}`}
}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600)}
function showSystem(name){
  const details={
    'Cardiovascular':{desc:'Cardiac telemetry simulation including heart rate, rhythm, blood pressure trend and peripheral perfusion.',items:[['Heart rate','72 BPM'],['ECG rhythm','Sinus-like pattern'],['Blood pressure','118 / 76 mmHg'],['Perfusion index','5.2']]},
    'Respiratory':{desc:'Respiratory performance simulation tracking oxygen saturation, breathing rate and gas exchange indicators.',items:[['SpO₂','98 %'],['Respiratory rate','16 / min'],['End-tidal CO₂','Normal range'],['Airway status','Clear']]},
    'Neuro & mental':{desc:'Illustrative neuro-behavioural monitoring for alertness, stress, cognitive workload and sleep-related fatigue.',items:[['Alertness','High'],['Stress index','Low–moderate'],['Cognitive load','Balanced'],['Fatigue','Low']]},
    'Musculoskeletal':{desc:'Activity and mobility indicators used to follow exercise, muscle loading and bone-health risk factors.',items:[['Activity level','Moderate'],['Muscle load','Balanced'],['Mobility','Normal'],['Exercise plan','On schedule']]},
    'Sleep & fatigue':{desc:'Recovery simulation based on sleep duration, rest quality and accumulated fatigue indicators.',items:[['Sleep duration','7 h 42 min'],['Sleep quality','Good'],['Recovery score','90 / 100'],['Fatigue index','Low']]}
  };
  const d=details[name]||details['Cardiovascular'];$('modalTitle').textContent=name;$('modalText').textContent=d.desc;
  $('modalReadings').innerHTML=d.items.map(([k,v])=>`<div class="reading"><small>${k.toUpperCase()}</small><b>${v}</b></div>`).join('');
  $('modalBackdrop').classList.add('open');
}
document.querySelectorAll('.organ-pin').forEach(pin=>pin.addEventListener('click',()=>showSystem(pin.dataset.organ)));
document.querySelectorAll('.system-row').forEach(row=>row.addEventListener('click',()=>showSystem(row.querySelector('.system-info b').textContent)));
$('modalClose').addEventListener('click',()=>$('modalBackdrop').classList.remove('open'));
$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))$('modalBackdrop').classList.remove('open')});
$('pauseBtn').addEventListener('click',()=>{running=!running;$('pauseBtn').innerHTML=running?'Ⅱ&nbsp; Pause':'▶&nbsp; Resume';toast(running?'Telemetry simulation resumed':'Telemetry simulation paused')});
$('alertBtn').addEventListener('click',()=>{alertMode=!alertMode;$('systemStatus').textContent=alertMode?'CAUTION':'NOMINAL';$('systemStatus').style.color=alertMode?'#ffc66e':'#51e0ad';$('alertBtn').textContent=alertMode?'✓ Clear alert':'⚠ Simulate alert';$('alertBtn').classList.toggle('danger',!alertMode);toast(alertMode?'Simulated abnormal vital pattern activated':'Simulation returned to nominal pattern')});
$('inspectAll').addEventListener('click',()=>showSystem('Cardiovascular'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.nav a').forEach(n=>n.classList.remove('active'));a.classList.add('active')}));
window.addEventListener('resize',()=>{Object.values(series).forEach(s=>drawLine(s.canvas,s.values,s.color));drawECG()});
Object.values(series).forEach(s=>drawLine(s.canvas,s.values,s.color));drawECG();
setInterval(update,1000);
