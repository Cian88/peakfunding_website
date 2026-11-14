"""Réexporte le film d’accueil avec les polices installées par npm ci.

Dépendances Python : Pillow, numpy, imageio-ffmpeg, fonttools et Brotli.
"""

import argparse
from functools import lru_cache
import importlib.util
from io import BytesIO
from pathlib import Path
import subprocess

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
FPS = 60
DURATION = 22
FADE = 1.15


@lru_cache
def font(size, weight, mono):
    family = "geist-mono" if mono else "geist"
    source = ROOT / "node_modules" / "@fontsource-variable" / family / "files"
    buffer = BytesIO()
    with TTFont(source / f"{family}-latin-wght-normal.woff2") as face:
        face.flavor = None
        face.save(buffer)
    buffer.seek(0)
    loaded = ImageFont.truetype(buffer, size)
    loaded.set_variation_by_axes([weight])
    return loaded


def draw_text(image, xy, value, size, color="#edeae4", weight=300, mono=False):
    if value.startswith("En option : PEAK EXCHANGE"):
        return
    draw = ImageDraw.Draw(image)
    x, y = (coordinate * 2 for coordinate in xy)
    is_title = size >= 76 and color == "#edeae4" and not mono
    face = font(size * 2, 400 if is_title else weight, mono)
    tracking = (0.08 if mono else -0.03 if is_title else 0) * size * 2
    for line in value.split("\n"):
        if tracking:
            # Le cumul des avances conserve le crénage sous l’espacement du site.
            baseline = y - face.getbbox(line, anchor="ls")[1]
            for index, letter in enumerate(line):
                advance = face.getlength(line[:index + 1]) - face.getlength(letter)
                draw.text((x + advance + tracking * index, baseline), letter, font=face, fill=color, anchor="ls")
        else:
            draw.text((x, y), line, font=face, fill=color, anchor="lt")
        y += size * 2 * 1.08


def render(source, output):
    spec = importlib.util.spec_from_file_location("stable", source)
    stable = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(stable)
    stable.text = draw_text
    output.mkdir(parents=True, exist_ok=True)
    slides = [stable.slide(index) for index in range(5)]
    slides[-1].resize((1920, 1080), Image.Resampling.LANCZOS).save(output / "pitch-hero-poster.jpg", quality=95)

    uhd = output / "pitch-hero-uhd.mp4"
    writer = stable.imageio_ffmpeg.write_frames(
        str(uhd), (stable.W, stable.H), fps=FPS, codec="libx264", macro_block_size=2,
        pix_fmt_in="rgb24", pix_fmt_out="yuv420p",
        output_params=["-crf", "18", "-preset", "fast", "-threads", "4", "-g", "60", "-movflags", "+faststart"],
    )
    writer.send(None)
    cached = [slide.tobytes() for slide in slides]
    try:
        for frame in range(DURATION * FPS):
            time = frame / FPS
            scene = next((i for i in range(5) if time < stable.s.TIMES[i + 1]), 4)
            elapsed = time - stable.s.TIMES[scene]
            if scene and elapsed < FADE:
                ratio = elapsed / FADE
                progress = ratio ** 3 * (ratio * (ratio * 6 - 15) + 10)
                pixels = Image.blend(slides[scene - 1], slides[scene], progress).tobytes()
            else:
                pixels = cached[scene]
            writer.send(pixels)
            if frame and frame % (FPS * 5) == 0:
                print(f"{time:g} / {DURATION} s", flush=True)
    finally:
        writer.close()

    ffmpeg = stable.imageio_ffmpeg.get_ffmpeg_exe()
    hd = output / "pitch-hero-hd.mp4"
    subprocess.run([
        ffmpeg, "-y", "-v", "error", "-i", str(uhd), "-vf", "scale=1920:1080:flags=lanczos",
        "-c:v", "libx264", "-crf", "19", "-preset", "fast", "-threads", "4", "-movflags", "+faststart", "-an", str(hd),
    ], check=True)
    for film in (uhd, hd):
        subprocess.run([ffmpeg, "-v", "error", "-xerror", "-threads", "2", "-i", str(film), "-f", "null", "-"], check=True)
        print(f"{film.name} vérifié ({film.stat().st_size} octets)", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT.parent / "peak-dossier/scripts/create-peak-pitch-stable.py")
    parser.add_argument("--output", type=Path, default=ROOT / "public/peak-pitch")
    args = parser.parse_args()
    render(args.source, args.output)
