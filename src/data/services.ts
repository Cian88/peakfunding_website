import type {Lang} from '../i18n';
export const services=(lang:Lang)=>lang==='en'?[
 {name:'The book',path:'/livre/',detail:'Understand what banks look for.',price:'€24.90'},
 {name:'PEAK PITCH',path:'/peak-pitch/',detail:'Prepare your own mortgage application and get three PDFs.',price:'€99 · VAT not applicable'},
 {name:'PEAK EXCHANGE',path:'/peak-exchange/',detail:'Review your application with a broker and receive a written advice note.',price:'€299 incl. VAT'},
]:[
 {name:'Le livre',path:'/livre/',detail:'Comprendre les attentes des banques.',price:'24,90 €'},
 {name:'PEAK PITCH',path:'/peak-pitch/',detail:'Préparer votre dossier de prêt et obtenir trois PDF.',price:'99 € · TVA non applicable'},
 {name:'PEAK EXCHANGE',path:'/peak-exchange/',detail:'Analyser votre dossier avec un courtier et recevoir une note de conseil.',price:'299 € TTC'},
];
