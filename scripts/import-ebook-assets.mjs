// Import explicite des éditions et extraits choisis par Valentin.
// Les éditions complètes ne sont jamais placées dans public/ ou dist/.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i+=2){if(!/^--(?:livre|extrait)-(?:fr|en)$/.test(args[i])||!args[i+1])throw new Error('Arguments : --livre-fr chemin --livre-en chemin --extrait-fr chemin --extrait-en chemin');options[args[i].slice(2)]=path.resolve(args[i+1]);}
if(!Object.keys(options).length)throw new Error('Indiquez les fichiers à importer.');
const manifestPath=path.join(root,'src/data/ebook-assets.json'),assets=JSON.parse(await fs.readFile(manifestPath,'utf8'));
const privateRoot=path.join(root,'private/ebook');
await fs.mkdir(privateRoot,{recursive:true});
const recordPath=path.join(privateRoot,'manifest.json');
let records={};try{records=JSON.parse(await fs.readFile(recordPath,'utf8'));}catch{}
const loaded={};
// Valider tous les documents avant de modifier une destination.
for(const [key,file]of Object.entries(options)){
 const data=await fs.readFile(file);
 if(data.subarray(0,5).toString()!=='%PDF-')throw new Error(key+' : un PDF est requis.');
 loaded[key]={data,hash:crypto.createHash('sha256').update(data).digest('hex'),source:path.basename(file)};
}
for(const lang of ['fr','en']){
 const sample=loaded['extrait-'+lang],book=loaded['livre-'+lang];
 if(sample&&sample.hash===(book?.hash||records[lang]?.sha256))throw new Error('Le document complet ne peut pas servir d’extrait public : '+lang);
}
for(const lang of ['fr','en']){
 const book=loaded['livre-'+lang],sample=loaded['extrait-'+lang];
 if(book){await fs.writeFile(path.join(privateRoot,'ebook-'+lang+'.pdf'),book.data);records[lang]={source:book.source,sha256:book.hash,bytes:book.data.length};}
 if(sample){const directory=path.join(root,'public/extraits');await fs.mkdir(directory,{recursive:true});await fs.writeFile(path.join(directory,'ebook-'+lang+'.pdf'),sample.data);assets[lang].excerpt='/extraits/ebook-'+lang+'.pdf';}
}
await fs.writeFile(recordPath,JSON.stringify(records,null,2)+'\n');
await fs.writeFile(manifestPath,JSON.stringify(assets,null,2)+'\n');
console.log('Import terminé : '+Object.keys(options).join(', ')+'. Éditions complètes conservées dans private/ebook, hors Git.');
