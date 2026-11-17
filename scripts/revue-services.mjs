import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base='http://127.0.0.1:4397';
const output=path.resolve(process.argv[2] || '../_revues/clone-services/apres');
mkdirSync(output,{recursive:true});
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(p+'/'+f.name):[p+'/'+f.name]);
const pages=process.env.REVIEW_ROUTES?JSON.parse(process.env.REVIEW_ROUTES):walk('dist').filter(p=>p.endsWith('.html')).map(p=>'/'+p.slice(5).replace(/index\.html$/,''));
const browser=await chromium.launch({headless:true});
const report=[],errors=[];
for(const [name,viewport] of Object.entries({desktop:{width:1440,height:900},mobile:{width:390,height:844}})){
 const context=await browser.newContext({viewport,reducedMotion:'reduce',isMobile:name==='mobile',hasTouch:name==='mobile'});
 // Revue locale : aucun appel aux services externes, aucune commande réelle.
 await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.fulfill({status:204,body:''}));
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push({page:page.url(),error:e.message}));
 for(const route of pages){
  const response=await page.goto(base+route,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{
   await document.fonts.ready;
   document.querySelectorAll('.reveal,.reveal-groupe>*').forEach(el=>el.classList.add('visible','est-visible','is-visible'));
   document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.loading='eager');
  });
  await page.waitForTimeout(120);
  const id=(route==='/'?'index':route.replace(/^\//,'').replaceAll('/','_').replace(/\.html$/,''));
  await page.screenshot({path:path.join(output,name+'_'+id+'-haut.png')});
  await page.screenshot({path:path.join(output,name+'_'+id+'-plein.jpg'),fullPage:true,type:'jpeg',quality:68});
  const state=await page.evaluate(()=>({
   title:document.title,
   h1:document.querySelector('h1')?.textContent.trim(),
   h1Visible:(()=>{const el=document.querySelector('h1'),r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>10&&r.height>10&&s.visibility==='visible'&&s.display!=='none'&&!el.classList.contains('sr-only');})(),
   overflow:document.documentElement.scrollWidth>innerWidth+1,
   scrollbar:getComputedStyle(document.documentElement).scrollbarWidth,
   reading:!!document.querySelector('[data-reading-progress]'),
   brokenImages:[...document.images].filter(img=>img.getBoundingClientRect().width>0&&(!img.complete||!img.naturalWidth)).map(img=>img.currentSrc||img.src),
   poster:document.querySelector('.pitch-cinema-poster img')?.currentSrc,
   posterAligned:(()=>{const image=document.querySelector('.pitch-cinema-poster'),video=document.querySelector('[data-pitch-cinema-film]');if(!image||!video)return true;const a=image.getBoundingClientRect(),b=video.getBoundingClientRect();return ['x','y','width','height'].every(k=>Math.abs(a[k]-b[k])<=1);})(),
   nameUnbroken:[...document.querySelectorAll('.exchange-lead .whitespace-nowrap')].every(el=>el.getClientRects().length===1)
  }));
  report.push({viewport:name,route,status:response.status(),...state});
 }
 // Parcours et accessibilité du menu après la suppression du signet.
 await page.goto(base+'/',{waitUntil:'networkidle'});
 if(name==='desktop'){
  await page.locator('[data-services] summary').click();
  await page.keyboard.press('Escape');
  report.push({check:'menu Escape',viewport:name,ok:!await page.locator('[data-services]').evaluate(el=>el.open)});
 }else{
  await page.locator('[data-menu] summary').click();
  await page.screenshot({path:path.join(output,'mobile-menu.png')});
 }
 await context.close();
}
const context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage();
await page.goto(base+'/',{waitUntil:'networkidle'});
await page.waitForFunction(()=>{const v=document.querySelector('video');return v&&!v.paused&&v.currentTime>0.2},{},{timeout:15000});
report.push({check:'film en lecture',ok:true});
await page.locator('[data-pitch-pause]').click();
report.push({check:'pause vidéo',ok:await page.locator('video').evaluate(v=>v.paused)});
await page.screenshot({path:path.join(output,'desktop-film-pause.png')});
await context.close();
await browser.close();
writeFileSync(path.join(output,process.env.REVIEW_ROUTES?'rapport-navigateur-cible.json':'rapport-navigateur.json'),JSON.stringify({pages:pages.length,report,errors},null,2));
const failures=report.filter(x=>x.ok===false||x.overflow||x.h1Visible===false||x.posterAligned===false||x.nameUnbroken===false||x.scrollbar==='none'||x.reading||x.brokenImages?.length);
console.log(JSON.stringify({pages:pages.length,captures:pages.length*4+2,failures,errors},null,2));
if(failures.length||errors.length)process.exitCode=1;
