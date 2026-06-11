# PCB Pattern Generator

A single-file, zero-dependency procedural SVG generator that produces circuit-board-style artwork — layered grids, dots, rings, and orthogonal paths — entirely in the browser.

---

## What it does

The generator builds a layered decorative pattern inspired by PCB (printed circuit board) trace layouts:

1. **Grid** — a tiled background of lines and intersection markers in one of three topologies.
2. **Dots** — randomly placed discs constrained to live on grid lines or at intersections, with a size distribution biased toward small dots.
3. **Dots** — randomly placed discs constrained to live on grid lines or at intersections, with a size distribution biased toward small dots. Dots are never spawned on the canvas border (within 2px of any edge), so the outermost grid lines and intersections stay clean.
4. **Rings** — a subset of dots is selected (preferring larger ones) and decorated with an outer concentric circle.
5. **Paths** — pairs of dots are connected by traces that follow the grid's main directions. On square grids, traces are strictly orthogonal with rounded corners, similar to PCB copper routes. On triangle and hex grids, traces follow the grid's own line directions. Crossings between paths are controlled by a parameter.

Everything is rendered as inline SVG and can be exported as a standalone `.svg` file.

---

## Architecture

The file is a self-contained HTML page (~400 lines). It has no build step, no dependencies, and no external assets. All logic lives in a single `<script>` block structured into clearly separated sections.

### Parameter binding

All parameters are declared at the top of the script as a flat `params` object. A `bindings` array maps each HTML control `id` → live value label `id` → `params` key. A single `readParams()` call at the start of `generate()` syncs the entire UI into `params` before any drawing happens. Adding a new parameter only requires one entry in the bindings array and one HTML input.

### Grid builders

Three grid builders share the same output contract:

```js
{ intersections: [{x, y}, ...], segments: [{x1, y1, x2, y2}, ...] }
```

- **`buildSquareGrid(W, H, S)`** — regular Cartesian grid, rows × columns.
- **`buildTriangleGrid(W, H, S)`** — square grid augmented with alternating diagonals, producing triangular cells.
- **`buildHexGrid(W, H, S)`** — flat-top hexagons built by iterating hex center positions and computing the 6 vertices per cell. Duplicate edges and vertices are deduplicated via a string key map.

### Dot placement — `placeDots(segments, intersections, P)`

Dots are placed iteratively with rejection sampling:

1. A random valid segment is picked, excluding segments where **both endpoints are blacklisted** and segments that lie entirely on the canvas border (both endpoints within 2px of an edge).
2. A position is sampled along the segment. The `positionBias` parameter controls the distribution: at `0`, positions always snap to endpoints (intersections); at `1`, the position is uniform along the segment length. Intermediate values pull the distribution toward the endpoints using a squared remap.
3. A minimum spacing check rejects any candidate closer than `dspacing × cellSize` to any already-placed dot.
4. On success, the **nearest intersection** to the placed dot is added to a blacklist, preventing subsequent dots from clustering around the same node.
5. A final border check rejects candidates whose center falls within 2px of any canvas edge. When snapping to an endpoint, the interior endpoint is preferred if one of the two lies on the border.
6. Dot radius is drawn from a skewed distribution: `r = min + (1 - u^(1/exp)) × (max - min)` where `exp = 1 + skew × 8`. At `skew = 0` this is approximately uniform; at `skew = 1` it concentrates all output near `min`.

### Ring selection

For each dot, a selection probability is computed as:

```
p = density × (sizeWeight × normalizedSize + (1 - sizeWeight))
```

`normalizedSize` is the dot's radius linearly mapped to `[0, 1]` across the full dot population. At `sizeWeight = 0` all dots have equal probability; at `1` only the largest are selected. The ring radius is drawn uniformly from `[dot.r × multMin, dot.r × multMax]`.

### Path generation

Two builders are available, selected by the grid topology:

**`buildOrthogonalPath(x1, y1, x2, y2, numTurns, cornerRadius, minStraight)`** — used for square grids. Same algorithm as before: turns are drawn from a power-law distribution biased toward 1-turn L-shapes, displacement is split into monotonic sub-segments on alternating axes, and corners are rounded with quadratic Bézier arcs clamped to half the shorter adjacent segment. The new `minStraight` argument (in px) is enforced both by clamping the number of H/V moves to `floor(|displacement| / minStraight)` and by rejecting any generated split whose part is shorter than the threshold. If the displacement is too small to support the requested `numTurns`, the realized turn count is silently reduced to `hMoves + vMoves - 1` (which is what the loop iterates) — this prevents reading undefined deltas and emitting `NaN` coordinates. The function returns `{ d, segments }` where `segments` is the list of straight segments before rounding (used for the crossing check). Returns `null` if any waypoint is non-finite.

**`buildGridPath(x1, y1, x2, y2, numTurns, directions, cornerRadius, minStraight)`** — used for triangle and hex grids. Each segment is constrained to one of the grid's main directions: `[(1,0), (0,1), (1,1), (-1,1)]` for the triangle grid, `[(1,0), (1/2, √3/2), (-1/2, √3/2)]` for the hex grid. The builder:

1. Filters out directions whose dot product with the overall displacement `(dx, dy)` is negative (no segment is allowed to make net backward progress).
2. Picks a random basis pair of forward directions.
3. Generates `numTurns - 1` free segments with random forward directions and random lengths ≥ `minStraight`.
4. Solves a 2×2 linear system to determine the last two segment lengths so the path lands exactly on the destination.
5. Rounds corners with quadratic Bézier arcs, skipping 180° turns (collinear joints) to avoid degenerate curves.
6. If 80 random attempts all fail to find a feasible solution, falls back to a deterministic 2-segment L built from the first pair of grid directions whose linear combination reproduces the displacement with non-negative lengths — so the path is always grid-aligned, never a diagonal straight line. If no such pair exists (degenerate displacement), the function returns `null` and the caller skips this dot pair.

Both builders return `{ d, segments }`. If either detects a non-finite coordinate at any point, it returns `null` and the caller skips the path.

**Crossing check** — after each candidate path is built, every straight segment is tested against all segments of previously drawn paths using a standard segment–segment intersection routine. If the intersection lies at a shared endpoint dot, it is allowed; otherwise the path is rejected and a new candidate is drawn. A `pcross` parameter controls this rule probabilistically: at `0` the check is always enforced, at `1` it is always skipped, and intermediate values mix the two with the corresponding probability.

---

## Parameters reference

| Section | Parameter | Effect |
|---|---|---|
| Canvas | Width / Height | SVG output dimensions in px |
| Colors | Background / Foreground | Two-color palette (hex) |
| Grid | Type | `square` / `triangle` / `hex` topology |
| Grid | Cell size | Spacing between intersections in px |
| Grid | Line width | Stroke width of grid lines in px |
| Grid | Intersection radius | Radius of the small dots at grid nodes in px |
| Dots | Min / Max size | Diameter range of placed dots in px |
| Dots | Count | Target number of dots (may be lower if spacing rejects candidates) |
| Dots | Skew | Size distribution skew: `0` = uniform, `1` = all minimum size |
| Dots | Position bias | `0` = snap to intersections only, `1` = uniform along segments |
| Dots | Min spacing | Minimum distance between dot centers, as a multiple of cell size |
| Rings | Density | Overall probability of a dot receiving a ring |
| Rings | Size weight | `0` = size-independent selection, `1` = only largest dots get rings |
| Rings | Mult min / max | Ring radius as a multiplier of the dot radius |
| Paths | Count | Number of traces to draw |
| Paths | Line width | Stroke width of traces in px |
| Paths | Corner radius | Bézier rounding radius at each turn in px |
| Paths | Max turns | Upper bound on the number of direction changes per trace |
| Paths | Complexity bias | `0` = mostly 1-turn L-shapes, `1` = up to max turns |
| Paths | Min straight | Minimum length of a straight segment, as a multiple of cell size (prevents tiny hairpin curves) |
| Paths | Crossing | `0` = paths are forbidden from intersecting, `1` = no enforcement (intermediate values mix the two) |

---

## Usage

Open `pcb-generator.html` in any modern browser. No server required.

- Adjust parameters in the sidebar — values update their labels live.
- Click **↺ Regenerate** to draw a new random composition with the current parameters.
- Click **↓ Export SVG** to download the current frame as a standalone `.svg` file.

---

## Known limitations

- The dot blacklist operates on the nearest intersection only. Dense grids with high dot counts and low spacing may exhaust valid placements before reaching the target count.
- With `Crossing = 0` and very dense path layouts, the generator may produce fewer paths than `Count` because most candidate pairs would cross an existing trace.
- Very large canvas sizes with hex grids can produce a high vertex count and slow rendering.
