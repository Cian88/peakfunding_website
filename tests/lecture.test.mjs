import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {transformSync} from 'esbuild';
const code=transformSync(readFileSync('src/scripts/lecture.ts','utf8'),{loader:'ts',format:'cjs',target:'es2022'}).code;

function page({lang='fr',height=3000,scroll=0,component=true}={}){
 const classes=new Set(),frames=new Map(),resize=[];let serial=0;
 const root={lang,scrollHeight:height,classList:{toggle(k,on){on?classes.add(k):classes.delete(k);},remove(k){classes.delete(k);}}};
 const range=Object.assign(new EventTarget(),{value:'0',attrs:{},setAttribute(k,v){this.attrs[k]=v;}});
 const trace={style:{},offsetHeight:44};
 const nodes={'[data-reading-trace]':trace,'[data-reading-position]':range};
 const dock={hidden:true,clientHeight:800,querySelector:s=>nodes[s]};
 const doc=Object.assign(new EventTarget(),{documentElement:root,body:{},querySelector:s=>s==='[data-reading-progress]'?(component?dock:null):null,querySelectorAll:()=>[]});
 const win=new EventTarget(),moves=[];
 const context=vm.createContext({module:{exports:{}},AbortController,document:doc,innerHeight:1000,scrollY:scroll,
  ResizeObserver:class{constructor(cb){this.cb=cb;resize.push(this);}observe(){}disconnect(){this.disconnected=true;}},
  requestAnimationFrame:fn=>{frames.set(++serial,fn);return serial;},cancelAnimationFrame:id=>frames.delete(id),
  addEventListener:win.addEventListener.bind(win),scrollTo:(x,y)=>{moves.push(y);context.scrollY=y;win.dispatchEvent(new Event('scroll'));}
 });
 vm.runInContext(code,context);
 return {start:context.module.exports.demarrerLecture,root,classes,range,dock,trace,resize,moves,context,doc,
  scroll(y){context.scrollY=y;win.dispatchEvent(new Event('scroll'));},flush(){const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn());},pending:()=>frames.size};
}

test('Lecture : position restaurée, défilement natif intact et bornes de début/fin',()=>{
 const p=page({scroll:1000});p.start();
 assert.equal(p.dock.hidden,false);assert.ok(p.classes.has('lecture-personnalisee'));
 assert.equal(p.range.value,'500');assert.equal(p.trace.style.transform,'translateY(378px)');
 assert.equal(p.moves.length,0,'le démarrage ne déplace pas la page');
 p.scroll(-50);p.flush();assert.equal(p.range.value,'0');
 p.scroll(9000);p.flush();assert.equal(p.range.value,'1000');assert.equal(p.range.attrs['aria-valuetext'],'100 % de la page · Lecture');
 assert.equal(p.moves.length,0,'aucune interception du scroll naturel');
});

test('Lecture : glisser ou clavier du range pilote la page et libellés anglais',()=>{
 const p=page({lang:'en'});p.start();p.range.value='750';p.range.dispatchEvent(new Event('input'));p.flush();
 assert.deepEqual(p.moves,[1500]);assert.equal(p.range.value,'750');assert.equal(p.range.attrs['aria-valuetext'],'75% of the page · Reading');
});

test('Lecture : contenu chargé tardivement, regroupement des frames et pages courtes',()=>{
 const p=page({height:1000});p.start();assert.equal(p.dock.hidden,true);assert.equal(p.classes.size,0);
 p.root.scrollHeight=5000;p.resize[0].cb();p.scroll(2000);p.scroll(2000);assert.equal(p.pending(),1);
 p.flush();assert.equal(p.dock.hidden,false);assert.equal(p.range.value,'500');
 p.root.scrollHeight=900;p.resize[0].cb();p.flush();assert.equal(p.dock.hidden,true);assert.equal(p.classes.size,0);
});

test('Lecture : navigation Astro et réinitialisation sans écouteurs ni frames résiduels',()=>{
 const p=page();p.start();p.scroll(200);p.doc.dispatchEvent(new Event('astro:before-swap'));
 assert.equal(p.pending(),0);assert.ok(p.resize[0].disconnected);assert.equal(p.dock.hidden,true);assert.equal(p.classes.size,0);
 p.scroll(500);assert.equal(p.pending(),0);
 p.start();p.start();p.range.value='500';p.range.dispatchEvent(new Event('input'));p.flush();
 assert.deepEqual(p.moves,[1000],'un seul déplacement après deux initialisations');
});

test('Lecture : composant absent, barre native conservée',()=>{
 const p=page({component:false});p.start();assert.equal(p.dock.hidden,true);assert.equal(p.classes.size,0);assert.equal(p.moves.length,0);
});
