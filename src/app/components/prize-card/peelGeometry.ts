// Geometry for peeling a sticker from its top-right corner.
//
// Dragging the corner C to a point P folds the sticker along the
// perpendicular bisector of C→P. Everything on C's side of that line is lifted
// off the card (so it's clipped away from the flat sticker), and the lifted
// piece is drawn as its mirror image across the fold, showing the sticker's
// back. All coordinates are in card pixels with the origin at the top left.

export type Point = { x: number; y: number };
type Polygon = Point[];

export interface Peel {
  /** Part of the sticker still stuck to the card. */
  kept: Polygon;
  /** Part lifted off, in un-mirrored card coordinates. */
  lifted: Polygon;
  /** CSS matrix() that mirrors the lifted part across the fold. */
  mirror: string;
  /** Background for the flap: a crease highlight that fades away from the fold. */
  shading: string;
}

const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y;

/** Clip a convex polygon to the half-plane where f(p) >= 0. */
function clip(poly: Polygon, f: (p: Point) => number): Polygon {
  const out: Polygon = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const fa = f(a);
    const fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

export function peelAt(w: number, h: number, p: Point): Peel | null {
  const c = { x: w, y: 0 };
  const vx = p.x - c.x;
  const vy = p.y - c.y;
  const len = Math.hypot(vx, vy);
  if (len < 1) return null;

  const n = { x: vx / len, y: vy / len };
  const m = { x: (c.x + p.x) / 2, y: (c.y + p.y) / 2 };
  const side = (q: Point) => (q.x - m.x) * n.x + (q.y - m.y) * n.y;

  // Overshoot the card by a couple of pixels so anti-aliasing on the clip
  // edge never lets the art bleed around the outside of the sticker.
  const b = 2;
  const rect: Polygon = [
    { x: -b, y: -b },
    { x: w + b, y: -b },
    { x: w + b, y: h + b },
    { x: -b, y: h + b },
  ];
  const kept = clip(rect, side);
  const lifted = clip(rect, (q) => -side(q));

  // Reflection across the fold: X' = (I - 2nnᵀ)X + 2(m·n)n
  const k = dot(m, n);
  const mirror = `matrix(${1 - 2 * n.x * n.x}, ${-2 * n.x * n.y}, ${
    -2 * n.x * n.y
  }, ${1 - 2 * n.y * n.y}, ${2 * k * n.x}, ${2 * k * n.y})`;

  // The back of the packet is kraft paper. Shade along -n (from the fold towards the original corner). CSS gradients
  // run along a line through the box centre, so work out where the fold sits
  // on that line to place the stops in pixels.
  const dir = { x: -n.x, y: -n.y };
  const angle = Math.atan2(dir.x, -dir.y);
  const lineLen = Math.abs(w * Math.sin(angle)) + Math.abs(h * Math.cos(angle));
  const start = { x: w / 2 - (dir.x * lineLen) / 2, y: h / 2 - (dir.y * lineLen) / 2 };
  const fold = (m.x - start.x) * dir.x + (m.y - start.y) * dir.y;
  const px = (d: number) => `${(fold + d).toFixed(1)}px`;
  const shading = `linear-gradient(${((angle * 180) / Math.PI).toFixed(2)}deg,
    #8d6a44 ${px(-1)}, #f3dcb6 ${px(0)}, #dcbb8c ${px(8)},
    #c49d6b ${px(50)}, #a7804f ${px(190)}, #8d6a44 ${px(420)})`;

  return { kept, lifted, mirror, shading };
}

export const toClipPath = (poly: Polygon) =>
  poly.length
    ? `polygon(${poly.map((q) => `${q.x.toFixed(1)}px ${q.y.toFixed(1)}px`).join(", ")})`
    : "polygon(0 0, 0 0, 0 0)";

/**
 * Where to put something inside the uncovered area, and how big it can be:
 * the centre and radius of a circle that sits comfortably inside it. Exact
 * (the incircle) for a triangle, which is what a corner peel uncovers; the
 * centroid with 2·area / perimeter for anything else.
 */
export function revealSpot(poly: Point[]): { x: number; y: number; r: number } | null {
  let a2 = 0;
  let cx = 0;
  let cy = 0;
  let perimeter = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const cross = p.x * q.y - q.x * p.y;
    a2 += cross;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
    perimeter += Math.hypot(q.x - p.x, q.y - p.y);
  }
  if (Math.abs(a2) < 1 || perimeter === 0) return null;
  const r = Math.abs(a2) / perimeter;

  if (poly.length === 3) {
    // Incentre: vertices weighted by the length of the side opposite each
    const [A, B, C] = poly;
    const a = Math.hypot(C.x - B.x, C.y - B.y);
    const b = Math.hypot(A.x - C.x, A.y - C.y);
    const c = Math.hypot(B.x - A.x, B.y - A.y);
    return { x: (a * A.x + b * B.x + c * C.x) / perimeter, y: (a * A.y + b * B.y + c * C.y) / perimeter, r };
  }
  return { x: cx / (3 * a2), y: cy / (3 * a2), r };
}
