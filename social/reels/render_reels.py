#!/usr/bin/env python3
import json, os, subprocess, shlex
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "assets"
OUT = ROOT / "social" / "reels" / "output"
OUT.mkdir(parents=True, exist_ok=True)

W,H,DUR = 1080,1920,12
BURGUNDY = "0x290710"
GOLD = "0xC8A96A"
CREAM = "0xF7F6F1"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

logo_svg = ASSETS / "rose-cottage-fold-logo.svg"
logo_png = OUT / "rose-cottage-fold-logo.png"
subprocess.run(["rsvg-convert","-w","520","-o",str(logo_png),str(logo_svg)], check=True)

campaign = [
  dict(n=1, slug="project-story", source="rose-cottage-story.mp4",
       kicker="ROSE COTTAGE FOLD", title="Six individual homes", subtitle="One considered village setting",
       detail="North Muskham · Nottinghamshire", cta="Explore the full story · FOX Atlas"),
  dict(n=2, slug="masterplan", source="rose-cottage-hero.mp4",
       kicker="THE MASTERPLAN", title="A farmstead courtyard", subtitle="Six homes arranged around a shared sense of place",
       detail="Farmhouse + barn-inspired architecture", cta="Explore the interactive masterplan"),
  dict(n=3, slug="plot-1-farmhouse", source="film-3.mp4",
       kicker="PLOT 01", title="The Farmhouse", subtitle="3 bedrooms · Two-storey detached",
       detail="Sitting room · Kitchen / dining / garden room", cta="Rose Cottage Fold · North Muskham"),
  dict(n=4, slug="plot-2-stalls", source="film-0.mp4",
       kicker="PLOT 02", title="The Stalls", subtitle="2 bedrooms · Single-storey barn range",
       detail="Open-plan kitchen · dining · sitting", cta="Explore Plot 02 · FOX Atlas"),
  dict(n=5, slug="plot-3-dairy", source="film-0.mp4",
       kicker="PLOT 03", title="The Dairy", subtitle="2 bedrooms · Single-storey barn range",
       detail="Single-level courtyard living", cta="Explore Plot 03 · FOX Atlas"),
  dict(n=6, slug="plot-4-threshing-barn", source="film-2.mp4",
       kicker="PLOT 04", title="The Threshing Barn", subtitle="4 bedrooms · Barn-inspired home",
       detail="Master suite · snug · threshing-style glazing", cta="Explore Plot 04 · FOX Atlas"),
  dict(n=7, slug="plot-5-granary", source="film-1.mp4",
       kicker="PLOT 05", title="The Granary", subtitle="4 bedrooms · Two-storey barn design",
       detail="Garden rooms · master suite · dressing area", cta="Explore Plot 05 · FOX Atlas"),
  dict(n=8, slug="plot-6-carthouse", source="film-1.mp4",
       kicker="PLOT 06", title="The Carthouse", subtitle="3 bedrooms · Two-storey barn design",
       detail="Open-plan living · master suite · brick stair", cta="Explore Plot 06 · FOX Atlas"),
  dict(n=9, slug="planning", source="site-plan-high-resolution.webp",
       kicker="PLANNING", title="25/01920/FUL", subtitle="Full planning application · six dwellings",
       detail="Newark & Sherwood DC · received 11 Nov 2025", cta="View the live planning record"),
  dict(n=10, slug="design-materials", source="aerial-reverse.webp",
       kicker="DESIGN LANGUAGE", title="Village character", subtitle="Russet brick · timber · red pantiles",
       detail="Heritage casements · conservation rooflights", cta="A fresh perspective on farmstead form"),
  dict(n=11, slug="location", source="film-location.mp4",
       kicker="THE LOCATION", title="North Muskham", subtitle="Main Street · Nottinghamshire",
       detail="Village setting near the Great North Road / A1", cta="Explore the local setting"),
  dict(n=12, slug="fox-enquiry", source="fox-land-story.mp4",
       kicker="FOX DIGITAL LAND", title="Every piece of land", subtitle="has a story.",
       detail="Planning & Architecture · Verve Architecture", cta="contact@foxvisiondesign.co.uk · 07903 859999"),
]

def esc(s):
    return str(s).replace("\\","\\\\").replace(":","\\:").replace("'","\\'").replace("%","\\%")

def draw(text, y, size, font=BOLD, color=CREAM, x="70", alpha=None):
    c = color if alpha is None else f"{color}@{alpha}"
    return f"drawtext=fontfile={font}:text='{esc(text)}':fontcolor={c}:fontsize={size}:x={x}:y={y}:line_spacing=12"

def render(item):
    src = ASSETS / item["source"]
    out = OUT / f'{item["n"]:02d}-{item["slug"]}.mp4'
    is_image = src.suffix.lower() in {".webp",".png",".jpg",".jpeg"}
    input_args = ["-loop","1","-i",str(src)] if is_image else ["-stream_loop","-1","-i",str(src)]
    input_args += ["-i",str(ASSETS/"fox-mark-gold.png"),"-i",str(logo_png)]

    if is_image:
        base = f"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0007,1.10)':d={DUR*30}:s=1080x1920:fps=30,eq=brightness=-0.05:saturation=0.88[base]"
    else:
        base = "[0:v]split=2[bg][fg];" \
               "[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=34,eq=brightness=-0.18:saturation=0.82[bg2];" \
               "[fg]scale=1080:1080:force_original_aspect_ratio=decrease[fg2];" \
               "[bg2][fg2]overlay=(W-w)/2:(H-h)/2[base]"

    filters = [
        base,
        "[base]drawbox=x=0:y=0:w=1080:h=330:color=0x290710@0.78:t=fill,"
        "drawbox=x=0:y=1450:w=1080:h=470:color=0x290710@0.88:t=fill,"
        + draw(item["kicker"],120,32,color=GOLD)
        + "," + draw(item["title"],175,66)
        + "," + draw(item["subtitle"],270,32,font=FONT,color=CREAM)
        + "," + draw(item["detail"],1535,31,font=FONT,color=CREAM)
        + "," + draw(item["cta"],1635,27,font=BOLD,color=GOLD)
        + "[txt]",
        "[1:v]scale=92:-1[fox]",
        "[2:v]scale=300:-1[project]",
        "[txt][fox]overlay=920:46[foxed]",
        "[foxed][project]overlay=70:1740:format=auto[final]"
    ]
    vf = ";".join(filters)

    cmd = ["ffmpeg","-y",*input_args,"-filter_complex",vf,"-map","[final]","-t",str(DUR),
           "-r","30","-an","-c:v","libx264","-preset","veryfast","-crf","21","-pix_fmt","yuv420p",
           "-movflags","+faststart",str(out)]
    print("Rendering", out.name)
    subprocess.run(cmd, check=True)

for item in campaign:
    render(item)

(Path(OUT)/"campaign.json").write_text(json.dumps(campaign, indent=2), encoding="utf-8")
print("Rendered", len(campaign), "reels to", OUT)
