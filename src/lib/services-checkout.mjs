// Ouverture commerciale uniquement après confirmation explicite de Stancer.
export function stancerServiceURL(env,service){
  if(env.PUBLIC_STANCER_READY!=='true')return null;
  const value=service==='pitch'?env.PUBLIC_PEAK_PITCH_URL:env.PUBLIC_PEAK_EXCHANGE_URL;
  if(service==='pitch'&&env.PUBLIC_PEAK_PITCH_ENABLED!=='true')return null;
  try{const url=new URL(value||'');if(url.protocol!=='https:'||url.username||url.password||url.hash||url.search)return null;return url.href.replace(/\/$/,'');}catch{return null;}
}
