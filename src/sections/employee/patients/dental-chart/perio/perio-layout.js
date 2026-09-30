import { useRef, useContext, useCallback, createContext } from 'react';

import { PD_WARN, PD_ALERT } from './perio-math';

// Colour band for a probing depth: ≤3 normal, 4–5 warning, ≥6 alert.
export const pdSeverity = (pd) => {
  if (!pd) return null;
  if (pd >= PD_ALERT) return 'alert';
  if (pd >= PD_WARN) return 'warn';
  return null;
};

// ── Geometry ──────────────────────────────────────────────────────────────────
// Shared by the data rows and the graph, so every number sits exactly above or
// below the point it draws. It is derived from the width the chart is given:
// the chart fills the available width, growing its cells, rows, text, graph and
// tooth drawings together. Below the minimum it stops shrinking (cells must stay
// easy to type into) and the chart scrolls horizontally instead.
export const MIN_CELL_W = 22; // one probing site at the smallest usable size
export const MAX_CELL_W = 38; // beyond this the chart only gets emptier, not clearer
export const LABEL_W = 104; // sticky row-label column (fixed)

const BASE_MIDLINE = 14;
// The graph grows more gently than the columns, so four graph strips never push
// the lower jaw far below the fold on a wide screen.
const MAX_GRAPH_GROWTH = 1.45;

/** Largest site width for which `count` teeth per arch fit in `availableWidth`. */
export function fitCellWidth(availableWidth, count) {
  if (!availableWidth || !count) return MIN_CELL_W;
  const perCell = (availableWidth - LABEL_W) / (3 * count + BASE_MIDLINE / MIN_CELL_W);
  return Math.max(MIN_CELL_W, Math.min(MAX_CELL_W, Math.floor(perCell)));
}

export function makeGeometry(cellWidth = MIN_CELL_W) {
  const k = cellWidth / MIN_CELL_W; // 1 at the minimum size
  const graphK = Math.min(k, MAX_GRAPH_GROWTH);

  const CELL_W = cellWidth;
  const TOOTH_W = CELL_W * 3;
  const MIDLINE_GAP = Math.round(BASE_MIDLINE * k);

  // Tooth outlines (constants/tooth-shapes.js) are 40 units wide and use about
  // 3 units per millimetre, so one scale drives both the drawing and the mm grid.
  const SHAPE_SCALE = 1.2 * graphK; // px per shape unit
  const MM = 3 * SHAPE_SCALE; // px per millimetre
  const GRAPH_H = Math.round(124 * graphK);
  const CROWN_SPACE = Math.round(46 * graphK); // px on the crown side of the CEJ

  // Upper teeth are drawn roots-up, so "apical" is up the screen for the upper
  // arch and down for the lower arch.
  const apicalDir = (arch) => (arch === 'upper' ? -1 : 1);
  const cejY = (arch) => (arch === 'upper' ? GRAPH_H - CROWN_SPACE : CROWN_SPACE);

  return {
    CELL_W,
    TOOTH_W,
    MIDLINE_GAP,
    LABEL_W,
    ROW_H: Math.round(24 * Math.min(k, 1.3)),
    FONT: Math.round(12 * Math.min(k, 1.3)),
    SHAPE_SCALE,
    MM,
    GRAPH_H,
    archWidth: (count) => count * TOOTH_W + MIDLINE_GAP,
    // Left edge of the i-th tooth column in an arch of `count` teeth.
    toothX: (index, count) => index * TOOTH_W + (index >= count / 2 ? MIDLINE_GAP : 0),
    cejY,
    mmToY: (arch, mm) => cejY(arch) + apicalDir(arch) * mm * MM,
  };
}

export const PerioGeometryContext = createContext(makeGeometry());

export const usePerioGeometry = () => useContext(PerioGeometryContext);

// ── Keyboard navigation ───────────────────────────────────────────────────────
// Editable rows in on-screen order, top to bottom. Upper arch: buccal above the
// graphs, palatal below; lower arch: lingual above, buccal below. Rows nearest
// the teeth are PD, with GM outside them.
export const EDIT_ROWS = [
  'upper-buccal-gm',
  'upper-buccal-pd',
  'upper-lingual-pd',
  'upper-lingual-gm',
  'lower-lingual-gm',
  'lower-lingual-pd',
  'lower-buccal-pd',
  'lower-buccal-gm',
];

// After a PD is typed the cursor runs left → right along the row, then on to
// the next PD row — the usual full-mouth probing sequence.
const PD_ROWS = EDIT_ROWS.filter((row) => row.endsWith('-pd'));

export function usePerioNav(columnCount) {
  const cells = useRef(new Map());

  const register = useCallback(
    (rowId, col) => (el) => {
      const key = `${rowId}:${col}`;
      if (el) cells.current.set(key, el);
      else cells.current.delete(key);
    },
    []
  );

  const focusCell = (rowId, col) => {
    const el = cells.current.get(`${rowId}:${col}`);
    if (el && !el.disabled) {
      el.focus();
      return true;
    }
    return false;
  };

  // Step along a row, skipping disabled cells (teeth that cannot be probed).
  const stepInRow = (rowId, col, delta) => {
    for (let c = col + delta; c >= 0 && c < columnCount; c += delta) {
      if (focusCell(rowId, c)) return true;
    }
    return false;
  };

  const move = useCallback(
    (rowId, col, direction) => {
      if (direction === 'left') stepInRow(rowId, col, -1);
      else if (direction === 'right') stepInRow(rowId, col, 1);
      else {
        const rows = EDIT_ROWS;
        const delta = direction === 'up' ? -1 : 1;
        for (let r = rows.indexOf(rowId) + delta; r >= 0 && r < rows.length; r += delta) {
          if (focusCell(rows[r], col)) return;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnCount]
  );

  const advance = useCallback(
    (rowId, col) => {
      if (stepInRow(rowId, col, 1)) return;
      const nextRows = PD_ROWS.slice(PD_ROWS.indexOf(rowId) + 1);
      nextRows.some((row) => focusCell(row, 0) || stepInRow(row, -1, 1));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnCount]
  );

  return { register, move, advance };
}
