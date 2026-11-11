from pathlib import Path
import importlib.util,sys,json,subprocess
source=Path('C:/Users/valen/dev/peak-dossier/scripts/create-peak-pitch-stable.py')
spec=importlib.util.spec_from_file_location('stable',source);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
original=m.text
def text(im,xy,value,*args,**kwargs):
    if value.startswith('En option : PEAK EXCHANGE'):return
    return original(im,xy,value,*args,**kwargs)
m.text=text
out=Path(__file__).resolve().parents[1]/'public/peak-pitch';out.mkdir(parents=True,exist_ok=True)
dest=out/'pitch-hero-uhd.mp4';fps=60
slides=[m.slide(n) for n in range(5)]
slides[4].resize((1920,1080),m.Image.Resampling.LANCZOS).save(out/'pitch-hero-poster.jpg',quality=95)
writer=m.imageio_ffmpeg.write_frames(str(dest),(m.W,m.H),fps=fps,codec='libx264',macro_block_size=2,pix_fmt_in='rgb24',pix_fmt_out='yuv420p',output_params=['-crf','18','-preset','fast','-threads','4','-g','60','-movflags','+faststart'])
writer.send(None);cached=[m.np.asarray(s).tobytes() for s in slides]
try:
    for k in range(22*fps):
        t=k/fps;n=next((i for i in range(5) if t<m.s.TIMES[i+1]),4);local=t-m.s.TIMES[n]
        if n and local<1.15:
            p=local/1.15;ease=p*p*p*(p*(p*6-15)+10)
            data=m.np.asarray(m.Image.blend(slides[n-1],slides[n],ease)).tobytes()
        else:data=cached[n]
        writer.send(data)
        if k and k%(fps*5)==0:print(f'{t:g} / 22 s',flush=True)
finally:writer.close()
ff=m.imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([ff,'-y','-v','error','-i',str(dest),'-vf','scale=1920:1080:flags=lanczos','-c:v','libx264','-crf','19','-preset','fast','-threads','4','-movflags','+faststart','-an',str(out/'pitch-hero-hd.mp4')],check=True)
subprocess.run([ff,'-v','error','-threads','2','-i',str(dest),'-f','null','-'],check=True)
print(json.dumps({'fps':fps,'duration':22,'camera':'fixed','crossfade_seconds':1.15,'old_exchange_option_removed':True,'decode':'passed','files':{p.name:p.stat().st_size for p in out.glob('pitch-hero-*')}}),flush=True)
