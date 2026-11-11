/** Repère de lecture uniquement : aucune interception du défilement ou de la navigation. */
let disposer: (()=>void)|undefined;
export function demarrerLecture(){
  disposer?.();
  const root=document.documentElement;
  const dock=document.querySelector<HTMLElement>('[data-reading-progress]');
  const path=dock?.querySelector<SVGPathElement>('[data-reading-path]');
  const trace=dock?.querySelector<SVGPathElement>('[data-reading-trace]');
  const point=dock?.querySelector<SVGGElement>('[data-reading-point]');
  const range=dock?.querySelector<HTMLInputElement>('[data-reading-position]');
  const percent=dock?.querySelector<HTMLElement>('[data-reading-percent]');
  if(!dock||!path||!trace||!point||!range||!percent||typeof path.getTotalLength!=='function')return;
  const controller=new AbortController(),{signal}=controller;
  const en=document.documentElement.lang==='en',total=path.getTotalLength();
  let frame=0,last=-1;
  const update=()=>{
    frame=0;
    const length=Math.max(0,root.scrollHeight-innerHeight);
    const p=length>1?Math.min(1,Math.max(0,scrollY/length)):0;
    dock.hidden=length<=1;
    root.classList.toggle('lecture-personnalisee',length>1);
    trace.style.strokeDashoffset=String(1-p);
    const at=path.getPointAtLength(total*p);
    point.setAttribute('transform',`translate(${at.x} ${at.y})`);
    range.value=String(Math.round(p*1000));
    const value=Math.round(p*100);
    if(value!==last){percent.textContent=String(value).padStart(2,'0')+' %';range.setAttribute('aria-valuetext',en?`${value}% of the page`:`${value} % de la page`);last=value;}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  range.addEventListener('input',()=>{
    // Le glisser et les touches natives du range pilotent la position, sans inertie artificielle.
    const length=Math.max(0,root.scrollHeight-innerHeight);
    scrollTo(0,length*Number(range.value)/1000);
    schedule();
  },{signal});
  addEventListener('scroll',schedule,{passive:true,signal});
  addEventListener('resize',schedule,{signal});
  const resize=typeof ResizeObserver!=='undefined'?new ResizeObserver(schedule):null;
  resize?.observe(document.body);
  update();
  disposer=()=>{controller.abort();resize?.disconnect();cancelAnimationFrame(frame);dock.hidden=true;root.classList.remove('lecture-personnalisee');};
  document.addEventListener('astro:before-swap',()=>disposer?.(),{once:true,signal});
}
