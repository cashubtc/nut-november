// Flat, outlined nut and leaf shapes in the site palette. Drawn on a canvas
// for the hero's falling nuts; the acorn is also exported as SVG path data for
// the stickers. Shapes are authored in a unit box (radius 1, origin centred).

export type NutKind = "acorn" | "peanut" | "leafGold" | "leafPumpkin";

export const NUT_KINDS: NutKind[] = ["acorn", "peanut", "acorn", "leafGold", "leafPumpkin"];

const BARK = "#5C2E12";
const NUT = "#C98A4B";
const CAP = "#7A4A22";
const PEANUT = "#E2B26B";
const LEAF_FILL: Record<"leafGold" | "leafPumpkin", string> = {
  leafGold: "#E0A63A",
  leafPumpkin: "#B94A16",
};

/** Draw one shape centred on the current origin, `r` pixels in radius. */
export function drawNut(ctx: CanvasRenderingContext2D, kind: NutKind, r: number) {
  ctx.save();
  ctx.scale(r, r);
  ctx.lineJoin = "round";
  ctx.strokeStyle = BARK;
  ctx.lineWidth = 0.09;

  if (kind === "acorn") {
    ctx.fillStyle = NUT;
    ctx.beginPath();
    ctx.ellipse(0, 0.18, 0.6, 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = CAP;
    ctx.beginPath();
    ctx.ellipse(0, -0.28, 0.78, 0.42, 0, Math.PI, Math.PI * 2);
    ctx.ellipse(0, -0.28, 0.78, 0.14, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = BARK;
    ctx.fillRect(-0.07, -0.95, 0.14, 0.28);
  } else if (kind === "peanut") {
    // Stroke both lobes thick first, then fill over the top so only the
    // outer outline survives where they overlap.
    ctx.lineWidth = 0.18;
    ctx.fillStyle = PEANUT;
    const lobes: [number, number][] = [
      [-0.42, 0.48],
      [0.4, 0.52],
    ];
    for (const [y, rad] of lobes) {
      ctx.beginPath();
      ctx.arc(0, y, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const [y, rad] of lobes) {
      ctx.beginPath();
      ctx.arc(0, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = LEAF_FILL[kind];
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.quadraticCurveTo(0.95, -0.25, 0, 0.92);
    ctx.quadraticCurveTo(-0.95, -0.25, 0, -1);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 0.06;
    ctx.beginPath();
    ctx.moveTo(0, -0.78);
    ctx.lineTo(0, 1.05);
    ctx.stroke();
  }
  ctx.restore();
}
