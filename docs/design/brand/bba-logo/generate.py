"""Vector reconstruction of the supplied Beauty Business Academy logo.

Geometry is measured from the owner-supplied 2000x667 raster (2026-11-02) and
kept in that pixel space, then translated to a tight artboard. Type is the
official OFL Montserrat variable font (source/), outlined at the weights and
tracking fitted to the raster, so the SVGs need no font at runtime.

    python3 docs/design/brand/bba-logo/generate.py            # from repo root
"""
import io
import math
import subprocess
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image

HERE = Path(__file__).resolve().parent
FONT = HERE / "source" / "Montserrat[wght].ttf"

# Palette (docs/design/SYSTEM.md). Raster samples in comments.
PLUM = "#782858"          # raster #680B34
NEUTRAL = "#ACA5AD"       # raster #BFBFC0 -> disabledNeutral, nearest palette neutral
INK = "#1D1B1F"           # raster #04050B
WHITE = "#FFFFFF"
PLUM_BORDER = "#D9B6CA"
MUTED = "#655F67"
PAGE = "#FAF9FA"

COLORWAYS = {
    # name: (intended surface, text, accent bar, secondary bar). Files stay
    # transparent; the surface is documentation for where the colourway goes.
    "primary": (PAGE, INK, PLUM, NEUTRAL),
    "inverse": (INK, WHITE, PLUM_BORDER, MUTED),
    "inverse-plum": (PLUM, WHITE, WHITE, PLUM_BORDER),
    "mono-ink": (PAGE, INK, INK, INK),
    "mono-white": (INK, WHITE, WHITE, WHITE),
}

# ---------------------------------------------------------------- symbol
SLOPE = 0.645  # horizontal run per unit of drop on every slanted edge
RADIUS = 42    # fillet on the obtuse corners (top-left, bottom-right)


def bar(top, bottom, left_at, left_x, width):
    """Parallelogram leaning right; left edge passes (left_x, left_at)."""
    xl = lambda y: left_x + SLOPE * (left_at - y)
    return [(xl(top), top), (xl(top) + width, top),
            (xl(bottom) + width, bottom), (xl(bottom), bottom)]


ACCENT_BAR = bar(167.5, 493.5, 199, 321, 115)
SECONDARY_BAR = bar(289.5, 540, 312, 401, 97)


def rounded(poly, radii):
    """SVG path for a clockwise convex polygon with per-corner fillets."""
    n = len(poly)
    parts = []
    for i, (px, py) in enumerate(poly):
        r = radii[i]
        if not r:
            parts.append(("L", (px, py)))
            continue
        ax, ay = poly[i - 1]
        bx, by = poly[(i + 1) % n]
        u1 = ((ax - px), (ay - py)); l1 = math.hypot(*u1); u1 = (u1[0] / l1, u1[1] / l1)
        u2 = ((bx - px), (by - py)); l2 = math.hypot(*u2); u2 = (u2[0] / l2, u2[1] / l2)
        half = math.acos(max(-1, min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / 2
        t = r / math.tan(half)
        p1 = (px + u1[0] * t, py + u1[1] * t)
        p2 = (px + u2[0] * t, py + u2[1] * t)
        parts.append(("L", p1))
        parts.append(("A", p2, r))
    out = []
    for j, part in enumerate(parts):
        if part[0] == "L":
            x, y = part[1]
            out.append(f"{'M' if j == 0 else 'L'}{x:.2f} {y:.2f}")
        else:
            x, y = part[1]
            out.append(f"A{part[2]} {part[2]} 0 0 1 {x:.2f} {y:.2f}")
    return "".join(out) + "Z"


def symbol_paths(radius=RADIUS):
    radii = [radius, 0, radius, 0]  # TL, TR, BR, BL
    return rounded(ACCENT_BAR, radii), rounded(SECONDARY_BAR, radii)


# ---------------------------------------------------------------- type
_fonts = {}


def font(wght):
    if wght not in _fonts:
        _fonts[wght] = instancer.instantiateVariableFont(TTFont(FONT), {"wght": wght})
    return _fonts[wght]


def kerning(f, left, right):
    gpos = f["GPOS"].table
    lookups = sorted({i for fr in gpos.FeatureList.FeatureRecord
                      if fr.FeatureTag == "kern" for i in fr.Feature.LookupListIndex})
    for li in lookups:
        lookup = gpos.LookupList.Lookup[li]
        for st in lookup.SubTable:
            if lookup.LookupType == 9:
                st = st.ExtSubTable
            cov = st.Coverage.glyphs
            if left not in cov:
                continue
            if st.Format == 1:
                for pvr in st.PairSet[cov.index(left)].PairValueRecord:
                    if pvr.SecondGlyph == right:
                        return getattr(pvr.Value1, "XAdvance", 0) or 0
            else:
                rec = st.Class1Record[st.ClassDef1.classDefs.get(left, 0)]
                v = rec.Class2Record[st.ClassDef2.classDefs.get(right, 0)].Value1
                adj = (getattr(v, "XAdvance", 0) or 0) if v else 0
                if adj:
                    return adj
    return 0


def outline(text, wght, size, tracking, left, baseline):
    """Outline text so its ink starts at x=left on the given baseline."""
    f = font(wght)
    gs, cmap = f.getGlyphSet(), f.getBestCmap()
    scale = size / f["head"].unitsPerEm
    names = [cmap[ord(c)] for c in text]

    def draw(x0, pen):
        x = x0
        for i, g in enumerate(names):
            gs[g].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
            x += f["hmtx"][g][0] * scale
            if i < len(names) - 1:
                x += (kerning(f, g, names[i + 1]) + tracking * 1000) * scale

    bp = BoundsPen(gs); draw(0, bp)
    pen = SVGPathPen(gs, ntos=lambda v: f"{round(v, 2):g}")
    draw(left - bp.bounds[0], pen)
    bp2 = BoundsPen(gs); draw(left - bp.bounds[0], bp2)
    return pen.getCommands(), bp2.bounds


# Fitted against the raster: cap heights 126 / 151 px, ink left edges 546 / 501.
LINE1 = dict(text="Beauty Business", wght=525, size=180, tracking=-0.0735, left=546, baseline=306)
LINE2 = dict(text="Academy", wght=450, size=215.7, tracking=-0.04, left=501, baseline=488)


# ---------------------------------------------------------------- output
def svg_doc(view, body, bg, title, w=None, h=None):
    x, y, vw, vh = view
    size = f' width="{w}" height="{h}"' if w else ""
    rect = f'<rect x="{x:g}" y="{y:g}" width="{vw:g}" height="{vh:g}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:g} {y:g} {vw:g} {vh:g}"{size} '
            f'role="img" aria-label="{title}"><title>{title}</title>{rect}{body}</svg>\n')


def bbox(paths_bounds):
    xs0, ys0, xs1, ys1 = zip(*paths_bounds)
    return min(xs0), min(ys0), max(xs1), max(ys1)


def poly_bounds(p):
    return min(x for x, _ in p), min(y for _, y in p), max(x for x, _ in p), max(y for _, y in p)


def build():
    a, s = symbol_paths()
    l1, b1 = outline(**LINE1)
    l2, b2 = outline(**LINE2)
    sym = bbox([poly_bounds(ACCENT_BAR), poly_bounds(SECONDARY_BAR)])
    full = bbox([sym, b1, b2])
    return dict(accent=a, secondary=s, line1=l1, line2=l2, sym=sym, full=full)


def write_all():
    g = build()
    svg_dir = HERE / "svg"; svg_dir.mkdir(exist_ok=True)
    for name, (_, text, accent, secondary) in COLORWAYS.items():
        bars = f'<path fill="{accent}" d="{g["accent"]}"/><path fill="{secondary}" d="{g["secondary"]}"/>'
        words = f'<g fill="{text}"><path d="{g["line1"]}"/><path d="{g["line2"]}"/></g>'
        x0, y0, x1, y1 = g["full"]
        (svg_dir / f"bba-logo-{name}.svg").write_text(
            svg_doc((x0, y0, x1 - x0, y1 - y0), bars + words, None, "Beauty Business Academy"))
        x0, y0, x1, y1 = g["sym"]
        (svg_dir / f"bba-symbol-{name}.svg").write_text(
            svg_doc((x0, y0, x1 - x0, y1 - y0), bars, None, "Beauty Business Academy"))
    return g


def square_view(sym, pad):
    x0, y0, x1, y1 = sym
    side = max(x1 - x0, y1 - y0) * (1 + 2 * pad)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return (cx - side / 2, cy - side / 2, side, side)


def rasterize(svg_text, w, h):
    png = subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h)],
                         input=svg_text.encode(), capture_output=True, check=True).stdout
    return Image.open(io.BytesIO(png)).convert("RGBA")


def write_icons(g):
    fav = HERE / "favicon"; fav.mkdir(exist_ok=True)
    bars = lambda acc, sec: f'<path fill="{acc}" d="{g["accent"]}"/><path fill="{sec}" d="{g["secondary"]}"/>'
    # Transparent tab icon; the browser's dark UI gets the inverse colourway.
    view = square_view(g["sym"], 0.02)
    style = (f"<style>.a{{fill:{PLUM}}}.s{{fill:{NEUTRAL}}}"
             f"@media (prefers-color-scheme:dark){{.a{{fill:{PLUM_BORDER}}}.s{{fill:{NEUTRAL}}}}}</style>")
    adaptive = style + f'<path class="a" d="{g["accent"]}"/><path class="s" d="{g["secondary"]}"/>'
    (fav / "favicon.svg").write_text(svg_doc(view, adaptive, None, "Beauty Business Academy"))
    flat = svg_doc(view, bars(PLUM, NEUTRAL), None, "Beauty Business Academy")
    small = {}
    for px in (16, 32, 48, 64, 96, 128):
        small[px] = rasterize(flat, px, px)
        small[px].save(fav / f"favicon-{px}.png")
    small[48].save(fav / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
                   append_images=[small[16], small[32]])
    # Opaque app icons: symbol on the page surface with platform-appropriate padding.
    for name, px, pad, bg in (("apple-touch-icon", 180, 0.2, WHITE),
                              ("icon-192", 192, 0.2, WHITE),
                              ("icon-512", 512, 0.2, WHITE),
                              ("icon-maskable-512", 512, 0.34, WHITE),
                              ("icon-512-plum", 512, 0.2, PLUM)):
        acc, sec = (WHITE, PLUM_BORDER) if bg == PLUM else (PLUM, NEUTRAL)
        doc = svg_doc(square_view(g["sym"], pad), bars(acc, sec), bg, "Beauty Business Academy")
        rasterize(doc, px, px).convert("RGB").save(fav / f"{name}.png")
    # Lockup PNG exports at common widths.
    png = HERE / "png"; png.mkdir(exist_ok=True)
    x0, y0, x1, y1 = g["full"]
    for name in ("primary", "inverse"):
        doc = (HERE / "svg" / f"bba-logo-{name}.svg").read_text()
        for w in (160, 240, 320, 480, 960):
            h = round(w * (y1 - y0) / (x1 - x0))
            rasterize(doc, w, h).save(png / f"bba-logo-{name}-{w}w.png")


if __name__ == "__main__":
    write_icons(write_all())
    print("done")
