"""Generate Beauty Business Academy logo concepts as outlined SVG.

Glyphs come from the project's self-hosted OFL fonts, instanced at fixed weights,
so the SVGs need no font at render time.
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

PLUM = "#782858"
INK = "#1D1B1F"
PAGE = "#FAF9FA"
WHITE = "#FFFFFF"
PLUM_BORDER = "#D9B6CA"
BLUSH = "#F7EFF4"

_fonts = {}


def font(name, wght):
    key = (name, wght)
    if key not in _fonts:
        f = TTFont(ROOT / f"src/assets/fonts/{name}.ttf")
        _fonts[key] = instancer.instantiateVariableFont(f, {"wght": wght})
    return _fonts[key]


def text(name, wght, s, size, x, y, tracking=0.0):
    """Return (path d, advance width, (xmin, ymin, xmax, ymax)) for s on baseline y."""
    f = font(name, wght)
    upm = f["head"].unitsPerEm
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()
    hmtx = f["hmtx"]
    scale = size / upm
    pen = SVGPathPen(gs, ntos=lambda v: f"{round(v, 1):g}")
    bpen = BoundsPen(gs)
    cx = x
    for i, ch in enumerate(s):
        g = cmap[ord(ch)]
        t = (scale, 0, 0, -scale, cx, y)
        gs[g].draw(TransformPen(pen, t))
        gs[g].draw(TransformPen(bpen, t))
        cx += hmtx[g][0] * scale
        if i < len(s) - 1:
            cx += tracking * size
    return pen.getCommands(), cx - x, bpen.bounds


def svg(w, h, body, bg=None, title="Beauty Business Academy"):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" '
        f'width="{w:g}" height="{h:g}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{rect}{body}</svg>\n"
    )


def r(v):
    return round(v, 2)


# ---------------------------------------------------------------------------
# Concept 01 — «Срез»: BBA monogram sliced by the site's "/" diagonal.
# Left piece is ink, right piece is plum, separated by a clean gap, the same
# relationship as the hero's charcoal photo / diagonal boundary / plum triangle.
# ---------------------------------------------------------------------------
SLANT = 0.36  # horizontal run per unit of height (~20°), close to the hero boundary


def cut_geometry(x, y, size, gap=None):
    """BBA outline plus the two clip polygons either side of the diagonal gap."""
    d, adv, (x0, y0, x1, y1) = text("Unbounded", 800, "BBA", size, x, y, tracking=-0.02)
    h = y1 - y0
    gap = gap if gap is not None else size * 0.05
    # The cut crosses the middle B: centre it on the middle of the whole word.
    mid = (x0 + x1) / 2 - size * 0.02
    pad = size
    top_c = mid + SLANT * h / 2
    bot_c = mid - SLANT * h / 2
    ty, by = y0 - pad, y1 + pad
    ext = SLANT * pad
    lpoly = [
        (x0 - pad, ty), (top_c + ext - gap / 2, ty),
        (bot_c - ext - gap / 2, by), (x0 - pad, by),
    ]
    rpoly = [
        (top_c + ext + gap / 2, ty), (x1 + pad, ty),
        (x1 + pad, by), (bot_c - ext + gap / 2, by),
    ]
    return d, lpoly, rpoly, (x0, y0, x1, y1)


def pts(p):
    return " ".join(f"{r(a)},{r(b)}" for a, b in p)


def cut_monogram(x, y, size, left, right, uid, gap=None):
    d, lpoly, rpoly, bounds = cut_geometry(x, y, size, gap)
    body = (
        f'<defs><clipPath id="{uid}L"><polygon points="{pts(lpoly)}"/></clipPath>'
        f'<clipPath id="{uid}R"><polygon points="{pts(rpoly)}"/></clipPath></defs>'
        f'<path d="{d}" fill="{left}" clip-path="url(#{uid}L)"/>'
        f'<path d="{d}" fill="{right}" clip-path="url(#{uid}R)"/>'
    )
    return body, bounds


def concept01_mark(bg, left, right, name):
    size = 200
    body, (x0, y0, x1, y1) = cut_monogram(0, 0, size, left, right, "c1" + name)
    m = 40
    w, h = (x1 - x0) + 2 * m, (y1 - y0) + 2 * m
    body = f'<g transform="translate({r(m - x0)},{r(m - y0)})">{body}</g>'
    (OUT / f"01-cut-mark-{name}.svg").write_text(svg(r(w), r(h), body, bg))


# Lockup proportions are tuned for header scale: at a 26px mark the first line
# keeps ~12px capitals and ACADEMY ~8px, instead of the 5px of a looser lockup.
LOCKUP_SIZE = 120
L1_SIZE, L2_SIZE, L2_TRACK = 54, 38, 0.3


def lockup_geometry():
    """All lockup parts in one space: mark top-left at (0, 0), baseline at cap height."""
    _, _, _, (x0, y0, x1, _) = cut_geometry(0, 0, LOCKUP_SIZE)
    cap = -y0
    d, lpoly, rpoly, (_, _, mx1, _) = cut_geometry(-x0, cap, LOCKUP_SIZE)
    gx = mx1 + LOCKUP_SIZE * 0.34
    _, _, b1 = text("Unbounded", 700, "BEAUTY BUSINESS", L1_SIZE, gx, 0)
    l1, w1, _ = text("Unbounded", 700, "BEAUTY BUSINESS", L1_SIZE, gx, -b1[1])
    l2, w2, _ = text("Manrope", 700, "ACADEMY", L2_SIZE, gx, cap, tracking=L2_TRACK)
    return {
        "mark": d, "left": lpoly, "right": rpoly, "markWidth": mx1,
        "rule": (mx1 + LOCKUP_SIZE * 0.17 - 1, 0, 2, cap),
        "line1": l1, "line2": l2,
        "width": gx + max(w1, w2 - L2_TRACK * L2_SIZE), "height": cap,
    }


def concept01_lockup(bg, left, right, word, sub, name):
    g = lockup_geometry()
    uid = "c1l" + name
    rx, ry, rw, rh = g["rule"]
    body = (
        f'<defs><clipPath id="{uid}L"><polygon points="{pts(g["left"])}"/></clipPath>'
        f'<clipPath id="{uid}R"><polygon points="{pts(g["right"])}"/></clipPath></defs>'
        f'<path d="{g["mark"]}" fill="{left}" clip-path="url(#{uid}L)"/>'
        f'<path d="{g["mark"]}" fill="{right}" clip-path="url(#{uid}R)"/>'
        f'<rect x="{r(rx)}" y="{r(ry)}" width="{rw}" height="{r(rh)}" fill="{right}"/>'
        f'<path d="{g["line1"]}" fill="{word}"/>'
        f'<path d="{g["line2"]}" fill="{sub}"/>'
    )
    m = 36
    body = f'<g transform="translate({m},{m})">{body}</g>'
    (OUT / f"01-cut-lockup-{name}.svg").write_text(
        svg(r(g["width"] + 2 * m), r(g["height"] + 2 * m), body, bg))


def emit_ts(path):
    """Runtime artwork for features/public-shell/brand-logo.tsx."""
    g = lockup_geometry()
    rx, ry, rw, rh = g["rule"]
    lines = [
        "// Generated by docs/design/brand/logo-concepts/generate.py — do not edit by hand.",
        "// Outlines come from the self-hosted OFL Unbounded/Manrope fonts in src/assets/fonts.",
        "export const brandLogoArtwork = {",
        f'  width: {r(g["width"])},',
        f'  height: {r(g["height"])},',
        f'  markWidth: {r(g["markWidth"])},',
        f'  mark: "{g["mark"]}",',
        f'  leftClip: "{pts(g["left"])}",',
        f'  rightClip: "{pts(g["right"])}",',
        f'  rule: {{ x: {r(rx)}, y: {r(ry)}, width: {rw}, height: {r(rh)} }},',
        f'  line1: "{g["line1"]}",',
        f'  line2: "{g["line2"]}",',
        "} as const;",
    ]
    Path(path).write_text("\n".join(lines) + "\n")


# ---------------------------------------------------------------------------
# Concept 02 — «Плитка»: plum tile with one purposeful cut corner; the removed
# corner returns as the detached slash of the shared Cut button.
# ---------------------------------------------------------------------------
def concept02_tile(name, tile, ink, slash, bg=None):
    S = 512
    c = 132  # corner cut length
    g = 26  # gap between tile edge and detached slash
    sw = 30  # slash thickness measured along the edge
    # Bottom-right cut so the edge reads as the brand's "/" direction.
    tile_poly = f"0,0 {S},0 {S},{S - c} {S - c},{S} 0,{S}"
    # Detached slash: parallelogram parallel to the cut edge, inside the removed corner.
    sl = [
        (S, S - c + g), (S, S - c + g + sw), (S - c + g + sw, S), (S - c + g, S),
    ]
    sl_pts = " ".join(f"{r(px)},{r(py)}" for px, py in sl)
    size = 156
    d, adv, (x0, y0, x1, y1) = text("Unbounded", 800, "BBA", size, 0, 0, tracking=-0.02)
    # Centre horizontally; sit slightly above centre so the cut corner has room.
    tx = (S - (x1 - x0)) / 2 - x0
    ty = (S - (y1 - y0)) / 2 - y0 - 18
    body = (
        f'<polygon points="{tile_poly}" fill="{tile}"/>'
        f'<polygon points="{sl_pts}" fill="{slash}"/>'
        f'<path transform="translate({r(tx)},{r(ty)})" d="{d}" fill="{ink}"/>'
    )
    (OUT / f"02-tile-{name}.svg").write_text(svg(S, S, body, bg))


# ---------------------------------------------------------------------------
# Concept 03 — «Строка»: header-scale wordmark. A single plum slash carries the
# brand device so it works at 16–20px cap height without the monogram.
# ---------------------------------------------------------------------------
def concept03(bg, word, accent, name):
    size = 56
    l1, w1, b1 = text("Unbounded", 800, "BEAUTY", size, 0, 0, tracking=-0.01)
    h = b1[3] - b1[1]
    sx = w1 + size * 0.18
    run = SLANT * h
    sw = size * 0.2
    slash = [(sx + run, b1[1]), (sx + run + sw, b1[1]), (sx + sw, b1[3]), (sx, b1[3])]
    nx = sx + run + sw + size * 0.14
    l2, w2, b2 = text("Unbounded", 800, "BUSINESS", size, nx, 0, tracking=-0.01)
    l3, w3, b3 = text("Manrope", 700, "ACADEMY", size * 0.43, 0, 0, tracking=0.5)
    line2_y = b1[3] + size * 0.62 - b3[1]
    pts = " ".join(f"{r(a)},{r(b)}" for a, b in slash)
    body = (
        f'<path d="{l1}" fill="{word}"/>'
        f'<polygon points="{pts}" fill="{accent}"/>'
        f'<path d="{l2}" fill="{word}"/>'
        f'<path transform="translate(0,{r(line2_y)})" d="{l3}" fill="{accent}"/>'
    )
    total_w = nx + w2
    total_h = (line2_y + b3[3]) - b1[1]
    m = 36
    body = f'<g transform="translate({m},{r(m - b1[1])})">{body}</g>'
    (OUT / f"03-wordmark-{name}.svg").write_text(svg(r(total_w + 2 * m), r(total_h + 2 * m), body, bg))


concept01_mark(None, INK, PLUM, "light")
concept01_mark(PLUM, WHITE, PLUM_BORDER, "plum")
concept01_mark(INK, WHITE, PLUM_BORDER, "charcoal")
concept01_lockup(None, INK, PLUM, INK, PLUM, "light")
concept01_lockup(INK, WHITE, PLUM_BORDER, WHITE, PLUM_BORDER, "charcoal")
concept01_lockup(PLUM, WHITE, PLUM_BORDER, WHITE, PLUM_BORDER, "plum")
concept02_tile("plum", PLUM, WHITE, PLUM)
concept02_tile("charcoal", INK, WHITE, PLUM_BORDER)
concept02_tile("blush", BLUSH, PLUM, PLUM)
concept03(None, INK, PLUM, "light")
concept03(INK, WHITE, PLUM_BORDER, "charcoal")
if len(sys.argv) > 3:
    emit_ts(sys.argv[3])
print("\n".join(sorted(p.name for p in OUT.glob("*.svg"))))
