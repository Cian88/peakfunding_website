/** Repère de lecture uniquement : aucune interception du défilement ou de la navigation. */
let disposer: (()=>void)|undefined;
export function demarrerLecture(){
  disposer?.();
  const root=document.documentElement;
  const dock=document.querySelector<HTMLElement>('[data-reading-progress]');
  const trace=dock?.querySelector<HTMLElement>('[data-reading-trace]');
  const range=dock?.querySelector<HTMLInputElement>('[data-reading-position]');
  if(!dock||!trace||!range)return;
  const label=dock.querySelector<HTMLElement>('[data-reading-section]');
  const sections=[...document.querySelectorAll<HTMLElement>('main > section')].map(node=>({node,name:node.querySelector('h1,h2')?.textContent?.replace(/\s+/g,' ').trim()})).filter(section=>section.name);
  const controller=new AbortController(),{signal}=controller;
  const en=document.documentElement.lang==='en';
  let frame=0,last='';
  const update=()=>{
    frame=0;
    const length=Math.max(0,root.scrollHeight-innerHeight);
    const p=length>1?Math.min(1,Math.max(0,scrollY/length)):0;
    dock.hidden=length<=1;
    root.classList.toggle('lecture-personnalisee',length>1);
    trace.style.transform=`translateY(${Math.max(0,dock.clientHeight-trace.offsetHeight)*p}px)`;
    let section=document.querySelector('main h1')?.textContent?.replace(/\s+/g,' ').trim()||(en?'Reading':'Lecture');
    for(const item of sections)if(item.node.getBoundingClientRect().top<=innerHeight*.42)section=item.name!;
    if(label)label.textContent=section;
    range.value=String(Math.round(p*1000));
    const value=Math.round(p*100);
    const description=(en?`${value}% of the page`:`${value} % de la page`)+' · '+section;
    if(description!==last){range.setAttribute('aria-valuetext',description);last=description;}
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
