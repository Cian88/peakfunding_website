import type {Lang} from '../i18n';
export const services=(lang:Lang)=>lang==='en'?[
 {name:'The book',path:'/livre/',detail:'Understand what banks look for.',price:'€24.90'},
 {name:'PEAK PITCH',path:'/peak-pitch/',detail:'Prepare your banking presentation.',price:'€99 · VAT not applicable'},
 {name:'PEAK EXCHANGE',path:'/peak-exchange/',detail:'Analyse your application and your arguments.',price:'€299 incl. VAT'},
]:[
 {name:'Le livre',path:'/livre/',detail:'Comprendre les attentes des banques.',price:'24,90 €'},
 {name:'PEAK PITCH',path:'/peak-pitch/',detail:'Préparer votre présentation bancaire.',price:'99 € · TVA non applicable'},
 {name:'PEAK EXCHANGE',path:'/peak-exchange/',detail:'Analyser votre dossier et vos arguments.',price:'299 € TTC'},
];
