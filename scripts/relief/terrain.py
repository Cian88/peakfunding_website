"""Rebuild the map from its local IGN sample. Use --fetch to replace the sample."""
import argparse
from collections import defaultdict
from datetime import date
import json
import math
from pathlib import Path
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path(__file__).with_name('puy-de-dome.json')
ASSET = ROOT / 'public/cartographie/relief.svg'
API = 'https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest/elevation.json'
RESOURCE = 'ign_rge_alti_wld'
# Regular local metric grid, WGS84 tangent approximation at the summit.
LON, LAT = 2.9642, 45.7724
COLS, ROWS, STEP = 91, 73, 32
WEST, NORTH = -1536, 1216
WIDTH, HEIGHT = 800, 640
INTERVAL = 15


def coordinate(col, row):
    return (LON + (WEST + col * STEP) / (111320 * math.cos(math.radians(LAT))),
            LAT + (NORTH - row * STEP) / 111132)


def fetch():
    grid = []
    for row in range(ROWS):
        coords = [coordinate(col, row) for col in range(COLS)]
        params = {'resource': RESOURCE, 'zonly': 'true',
                  'lon': '|'.join(f'{lon:.6f}' for lon, _ in coords),
                  'lat': '|'.join(f'{lat:.6f}' for _, lat in coords)}
        req = Request(API + '?' + urlencode(params), headers={'User-Agent': 'PEAK-FUNDING-static-map/1.0'})
        for attempt in range(3):
            try:
                with urlopen(req, timeout=35) as response:
                    sample = json.load(response)['elevations']
                if len(sample) != COLS or any(not 0 < z < 2000 for z in sample):
                    raise ValueError('Invalid elevation row')
                break
            except (OSError, ValueError):
                if attempt == 2:
                    raise
                time.sleep(2 ** (attempt + 1))
        grid.append(sample)
        time.sleep(.3)
    metadata = {'source': 'IGN – RGE ALTI®', 'resource': RESOURCE, 'retrieved': date.today().isoformat(),
                'origin': coordinate(0, 0), 'last': coordinate(COLS - 1, ROWS - 1),
                'grid_m': STEP, 'z_m': grid}
    temporary = CACHE.with_suffix('.tmp')
    temporary.write_text(json.dumps(metadata, separators=(',', ':'), ensure_ascii=False) + '\n')
    temporary.replace(CACHE)


def level_lines(grid, level):
    """Trace marching-squares isolines, resolving saddles by the cell mean."""
    neighbors = defaultdict(list)

    def add(a, b):
        if a != b:
            neighbors[a].append(b)
            neighbors[b].append(a)

    for r in range(ROWS - 1):
        for c in range(COLS - 1):
            corners = [(c, r, grid[r][c]), (c + 1, r, grid[r][c + 1]),
                       (c + 1, r + 1, grid[r + 1][c + 1]), (c, r + 1, grid[r + 1][c])]
            hits = []
            for a, b in zip(corners, corners[1:] + corners[:1]):
                if (a[2] < level) == (b[2] < level):
                    continue
                t = (level - a[2]) / (b[2] - a[2])
                hits.append((round((a[0] + t * (b[0] - a[0])) * WIDTH / (COLS - 1), 3),
                             round((a[1] + t * (b[1] - a[1])) * HEIGHT / (ROWS - 1), 3)))
            if len(hits) == 2:
                add(*hits)
            if len(hits) == 4:
                center = sum(v[2] for v in corners) / 4
                if (center < level) == (corners[0][2] < level):
                    add(hits[0], hits[1])
                    add(hits[2], hits[3])
                else:
                    add(hits[1], hits[2])
                    add(hits[3], hits[0])

    def trace(start):
        line = [start]
        while neighbors[line[-1]]:
            previous = line[-1]
            following = neighbors[previous].pop()
            neighbors[following].remove(previous)
            line.append(following)
        return line

    lines = [trace(k) for k in neighbors if len(neighbors[k]) == 1]
    lines.extend(trace(k) for k in neighbors if neighbors[k])
    return lines


def smooth(points):
    """Corner cutting on the sampled contours, retaining open endpoints."""
    closed = points[0] == points[-1]
    result = [] if closed else [points[0]]
    for (ax, ay), (bx, by) in zip(points, points[1:]):
        result.extend([(.75 * ax + .25 * bx, .75 * ay + .25 * by),
                       (.25 * ax + .75 * bx, .25 * ay + .75 * by)])
    result.append(result[0] if closed else points[-1])
    return result


def simplify(points, tolerance=.38):
    if len(points) <= 2:
        return points
    a, b = points[0], points[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    index, largest = 0, 0
    for i, (x, y) in enumerate(points[1:-1], 1):
        t = max(0, min(1, ((x-a[0])*dx + (y-a[1])*dy) / (dx*dx + dy*dy or 1)))
        distance = math.hypot(x-a[0]-t*dx, y-a[1]-t*dy)
        if distance > largest:
            index, largest = i, distance
    if largest <= tolerance:
        return [a, b]
    return simplify(points[:index+1], tolerance)[:-1] + simplify(points[index:], tolerance)


def render(data):
    grid = data['z_m']
    paper = '#f0f1eb'
    ink = '#26353a'
    signal = '#bb3e22'
    paths, labels = [], []
    principal = None
    occupied = [(490, 304), (532, 284), (600, 270), (73, 592), (750, 65)]
    for level in range(750, 1501, INTERVAL):
        major = level % 75 == 0
        lines = sorted(level_lines(grid, level + .0001), key=len, reverse=True)
        for points in lines:
            line = simplify(smooth(points))
            if len(line) < 3:
                continue
            d = 'M' + ' '.join(f'{round(x)},{round(y)}' for x, y in line)
            if line[0] == line[-1]:
                d += 'Z'
            if level == 1200 and principal is None:
                principal = d
            paths.append(f'<path d="{d}" stroke="{("#827d6c" if major else "#aca898")}" stroke-width="{1.6 if major else .85}"/>')
            if major and len(line) > 22:
                for i in range(len(line)//3, len(line)-2):
                    x, y = line[i]
                    if not 48 < x < 752 or not 48 < y < 590:
                        continue
                    if any(math.hypot(x-x0, y-y0) < 100 for x0, y0 in occupied):
                        continue
                    angle = math.degrees(math.atan2(line[i+1][1]-line[i-1][1], line[i+1][0]-line[i-1][0]))
                    angle = (angle + 90) % 180 - 90
                    labels.append(f'<text transform="translate({x:.1f} {y:.1f}) rotate({angle:.0f})" text-anchor="middle">{level}</text>')
                    occupied.append((x, y))
                    break
    scale_px = 500 * WIDTH / (STEP * (COLS - 1))
    summit_x = -WEST * WIDTH / (STEP * (COLS - 1))
    summit_y = NORTH * HEIGHT / (STEP * (ROWS - 1))
    crosses = ''.join(f'M{x-4} {y}h8m-4 -4v8' for x in range(40,800,120) for y in range(40,640,120))
    lines = ''.join(paths)
    figures = ''.join(labels)
    ASSET.write_text(f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640">
<title>Puy de Dôme · Chaîne des Puys</title>
<desc>Courbes de niveau tous les 15 mètres. Source IGN, RGE ALTI®, extraction du {data['retrieved']}, Licence Ouverte 2.0. https://www.data.gouv.fr/datasets/rge-alti-r</desc>
<defs><path id="courbe-repere" pathLength="1" d="{principal}"/></defs>
<rect width="800" height="640" fill="{paper}"/>
<g fill="none" stroke-linejoin="round" stroke-linecap="round">{lines}</g>
<path d="{crosses}" stroke="#858a81" stroke-width=".8" opacity=".7"/>
<g fill="{ink}" stroke="{paper}" paint-order="stroke" stroke-width="6" font-family="monospace" font-size="10" letter-spacing="1.3">{figures}</g>
<g transform="translate({summit_x:.1f} {summit_y:.1f})">
<circle r="9" fill="{paper}" stroke="{signal}" stroke-width="1.4"/><circle r="3.4" fill="{signal}"/>
<path d="M8 -6l48 -47h131" fill="none" stroke="{signal}" stroke-width="1.2"/>
<rect x="56" y="-83" width="132" height="29" fill="{paper}"/>
<text x="60" y="-62" font-family="Arial,sans-serif" font-size="20" font-weight="bold" letter-spacing="-.5" fill="{ink}">Puy de Dôme</text>
<text x="60" y="-35" fill="{ink}" font-family="monospace" font-size="13" letter-spacing="1" stroke="{paper}" stroke-width="6" paint-order="stroke">1 465 m</text>
</g>
<g transform="translate(751 30)" fill="{ink}" stroke="{paper}" paint-order="stroke" stroke-width="4">
<text x="0" y="10" text-anchor="middle" font-family="monospace" font-size="14">N</text>
<path d="M0 19l7 28 -7 -7 -7 7z"/><path d="M0 21v18l5 5z" fill="{paper}" stroke="none"/>
</g>
<g transform="translate(24 606)" fill="{ink}"><rect x="-8" y="-12" width="{scale_px+26:.1f}" height="35" fill="{paper}"/>
<path d="M0 -6v6h{scale_px:.1f}v-6m{-scale_px/2:.1f} 2v4" stroke="{ink}" fill="none"/>
<text y="16" font-family="monospace" font-size="12">0</text><text x="{scale_px:.1f}" y="16" text-anchor="end" font-family="monospace" font-size="12">500 m</text></g>
</svg>""")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--fetch', action='store_true')
    if parser.parse_args().fetch:
        fetch()
    render(json.loads(CACHE.read_text()))
