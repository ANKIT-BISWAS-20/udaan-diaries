"""Generates the static brand files (SVG + PNG icons + social card) from one set of path data.
Run:  python3 scripts/gen-brand.py   (needs Pillow)"""
import math, os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
ARCH = 'M7 61V31C7 21 17 17 24 12C28 9 30 6 32 2C34 6 36 9 40 12C47 17 57 21 57 31V61Z'
WING_L = 'M32 40C25 39 18 34 14 24C22 24 29 29 32 40Z'
WING_R = 'M32 40C39 39 46 34 50 24C42 24 35 29 32 40Z'
BODY = 'M32 33C30 38 30 44 32 50C34 44 34 38 32 33Z'
CURL_L = 'M19 28C22 29 25 32 28 36'
CURL_R = 'M45 28C42 29 39 32 36 36'
CREAM, A1, A2, INK = '#FFF8EC', '#C2410C', '#E8A317', '#1B1740'

def mark_body(bg1=A1, bg2=A2, fg=CREAM, gid='g'):
    dots = ''.join(f'<circle cx="{x}" cy="56" r="1.5" fill="{fg}" opacity=".9"/>' for x in (18, 25, 32, 39, 46))
    return (f'<defs><linearGradient id="{gid}" x1="8" y1="4" x2="56" y2="62" gradientUnits="userSpaceOnUse">'
            f'<stop offset="0" stop-color="{bg1}"/><stop offset="1" stop-color="{bg2}"/></linearGradient></defs>'
            f'<path d="{ARCH}" fill="url(#{gid})"/><circle cx="32" cy="17" r="3.2" fill="none" stroke="{fg}" stroke-width="1.6"/>'
            f'<path d="{WING_L}" fill="{fg}"/><path d="{WING_R}" fill="{fg}"/><path d="{BODY}" fill="{fg}"/><circle cx="32" cy="31" r="2.6" fill="{fg}"/>'
            f'<path d="{CURL_L}" fill="none" stroke="{A1}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>'
            f'<path d="{CURL_R}" fill="none" stroke="{A1}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>{dots}')

def svg(w, h, body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w*4 if w<100 else w}" height="{h*4 if w<100 else h}">{body}</svg>\n'
def write(name, text):
    os.makedirs(os.path.dirname(os.path.join(OUT, name)), exist_ok=True)
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(text)

write('favicon.svg', svg(64, 64, mark_body()))
write('brand/mark.svg', svg(64, 64, mark_body()))
write('brand/mark-mono.svg', svg(64, 64, f'<path d="{ARCH}" fill="{INK}"/><path d="{WING_L}" fill="{CREAM}"/><path d="{WING_R}" fill="{CREAM}"/><path d="{BODY}" fill="{CREAM}"/><circle cx="32" cy="17" r="3.2" fill="none" stroke="{CREAM}" stroke-width="1.6"/>'))
def lockup(ink, sub):
    return (f'<g transform="translate(0 4) scale(1.1)">{mark_body(gid="lg")}</g>'
            f'<text x="86" y="46" font-family="Google Sans Flex, Google Sans, system-ui, sans-serif" font-size="40" font-weight="700" letter-spacing="-1.5" fill="{ink}">Udaan</text>'
            f'<text x="88" y="68" font-family="Google Sans Code, ui-monospace, monospace" font-size="12" letter-spacing="6" fill="{sub}">DIARIES</text>')
write('brand/logo-light.svg', svg(260, 80, lockup(INK, A1)))
write('brand/logo-dark.svg', svg(260, 80, lockup('#FFF1DC', '#FFC83D')))

# ── PNG renders (supersampled polygons from the same bezier data) ──
def parse(d):
    toks, cur, out = d.replace(',', ' ').replace('M', ' M ').replace('C', ' C ').replace('V', ' V ').replace('Z', ' Z ').split(), None, []
    i = 0; pts = []; x = y = 0
    while i < len(toks):
        t = toks[i]
        if t == 'M': x, y = float(toks[i+1]), float(toks[i+2]); pts.append((x, y)); i += 3
        elif t == 'V': ny = float(toks[i+1]); pts.append((x, ny)); y = ny; i += 2
        elif t == 'C':
            i += 1
            while i < len(toks) and toks[i] not in 'MCVZ':
                c = [float(v) for v in toks[i:i+6]]; i += 6
                p0 = (x, y); p1, p2, p3 = (c[0], c[1]), (c[2], c[3]), (c[4], c[5])
                for s in range(1, 25):
                    t_ = s / 24; u = 1 - t_
                    pts.append((u**3*p0[0] + 3*u*u*t_*p1[0] + 3*u*t_*t_*p2[0] + t_**3*p3[0], u**3*p0[1] + 3*u*u*t_*p1[1] + 3*u*t_*t_*p2[1] + t_**3*p3[1]))
                x, y = p3
        else: i += 1
    return pts

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def hexc(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_mark(size, bg=None, scale=1.0, ox=0, oy=0):
    S = 4; n = size * S
    img = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    if bg: ImageDraw.Draw(img).rounded_rectangle((0, 0, n, n), radius=int(n * .22), fill=hexc(bg))
    k = n / 64 * scale; offx = (n - 64 * k) / 2 + ox * S; offy = (n - 64 * k) / 2 + oy * S
    T = lambda pts: [(offx + px * k, offy + py * k) for px, py in pts]
    # gradient arch
    mask = Image.new('L', (n, n), 0); ImageDraw.Draw(mask).polygon(T(parse(ARCH)), fill=255)
    grad = Image.new('RGBA', (n, n)); gp = grad.load()
    ax, ay, bx, by = offx + 8 * k, offy + 4 * k, offx + 56 * k, offy + 62 * k
    dx, dy = bx - ax, by - ay; L = dx * dx + dy * dy
    c1, c2 = hexc(A1), hexc(A2)
    for yy in range(n):
        for xx in range(n):
            t = max(0, min(1, ((xx - ax) * dx + (yy - ay) * dy) / L)); gp[xx, yy] = lerp(c1, c2, t) + (255,)
    img.paste(grad, (0, 0), mask)
    d = ImageDraw.Draw(img); cream = hexc(CREAM)
    for p in (WING_L, WING_R, BODY): d.polygon(T(parse(p)), fill=cream)
    hx, hy, hr = offx + 32 * k, offy + 31 * k, 2.6 * k
    d.ellipse((hx - hr, hy - hr, hx + hr, hy + hr), fill=cream)
    cx, cy, r = offx + 32 * k, offy + 17 * k, 3.2 * k
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=cream, width=max(1, int(1.6 * k)))
    for x in (18, 25, 32, 39, 46):
        r = 1.5 * k; cx, cy = offx + x * k, offy + 56 * k; d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=cream)
    return img.resize((size, size), Image.LANCZOS)

draw_mark(512, bg=CREAM, scale=.78).save(os.path.join(OUT, 'icon-512.png'))
draw_mark(192, bg=CREAM, scale=.78).save(os.path.join(OUT, 'icon-192.png'))
draw_mark(180, bg=CREAM, scale=.78).convert('RGB').save(os.path.join(OUT, 'apple-touch-icon.png'))
draw_mark(32, scale=1).save(os.path.join(OUT, 'favicon-32.png'))

# social card 1200x630
W, H = 1200, 630
card = Image.new('RGB', (W, H), hexc('#FFF8EC')); cd = ImageDraw.Draw(card)
for yy in range(H):  # soft warm wash on the right
    for xx in range(W // 2, W, 6):
        pass
cd.rectangle((W - 330, 0, W, H), fill=hexc('#FBEBCF'))
mk = draw_mark(420, scale=1.0); card.paste(mk, (W - 400, 110), mk)
def font(size, bold=True):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
              '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
cd.text((80, 190), 'Udaan', font=font(150), fill=hexc(INK))
cd.text((86, 360), 'D I A R I E S', font=font(40), fill=hexc(A1))
cd.text((86, 450), 'Stories from every corner of India', font=font(38, False), fill=hexc('#6B6182'))
card.save(os.path.join(OUT, 'og-image.png'))
print('brand files written')
