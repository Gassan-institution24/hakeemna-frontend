import PropTypes from 'prop-types';
import { memo, Fragment } from 'react';

import { alpha, useTheme } from '@mui/material/styles';

import { getToothShape } from '../constants/tooth-shapes';
import { pdSeverity, usePerioGeometry } from './perio-layout';
import { isImplant, isProbeable, screenSiteOrder } from './perio-math';


// Split charted sites into runs of neighbours, so a curve is never drawn across
// an unprobed site or a missing tooth.
function buildRuns(g, teeth, arch, side, draft, odontoMap) {
  const clampY = (y) => Math.min(g.GRAPH_H - 2, Math.max(2, y));
  const runs = [];
  let run = [];
  teeth.forEach((fdi, index) => {
    const x0 = g.toothX(index, teeth.length);
    const probeable = isProbeable(odontoMap[fdi]);
    screenSiteOrder(fdi, side).forEach((key, k) => {
      const site = probeable ? draft[fdi]?.sites?.[key] : null;
      if (!site?.pd) {
        if (run.length) runs.push(run);
        run = [];
        return;
      }
      const gm = site.gm || 0;
      run.push({
        key: `${fdi}-${key}`,
        x: x0 + g.CELL_W * (k + 0.5),
        gmY: clampY(g.mmToY(arch, gm)),
        pocketY: clampY(g.mmToY(arch, gm + site.pd)),
        site,
      });
    });
  });
  if (run.length) runs.push(run);
  return runs;
}

/**
 * Graphical strip for one side of one arch: tooth outlines anchored on their
 * CEJ, a millimetre grid, the gingival-margin line and the pocket-bottom line
 * (margin + probing depth), with the pocket shaded between them.
 *
 * Drawn left-to-right in anatomical order regardless of UI direction.
 */
function PerioGraph({ arch, side, teeth, draft, odontoMap }) {
  const theme = useTheme();
  const g = usePerioGeometry();
  const { GRAPH_H, TOOTH_W, SHAPE_SCALE } = g;
  const dark = theme.palette.mode === 'dark';
  const width = g.archWidth(teeth.length);
  const cej = g.cejY(arch);
  const flip = arch === 'upper' ? -SHAPE_SCALE : SHAPE_SCALE;

  const toothFill = dark ? '#3a4454' : '#f5f1e8';
  const toothStroke = dark ? '#6b7788' : '#b9c0ca';
  const implantFill = dark ? '#7c8896' : '#a7b1bd';
  const gridColor = theme.palette.divider;
  const marginColor = theme.palette.primary.main;
  const pocketColor = theme.palette.error.main;

  // mm grid: every millimetre faintly, every 5 mm a little stronger.
  const gridLines = [];
  for (let mm = -10; mm <= 25; mm += 1) {
    const y = g.mmToY(arch, mm);
    if (mm !== 0 && y > 0 && y < GRAPH_H) {
      gridLines.push(
        <line
          key={`g${mm}`}
          x1={0}
          x2={width}
          y1={y}
          y2={y}
          stroke={gridColor}
          strokeWidth={mm % 5 === 0 ? 0.9 : 0.4}
          opacity={mm % 5 === 0 ? 0.9 : 0.55}
        />
      );
    }
  }

  const runs = buildRuns(g, teeth, arch, side, draft, odontoMap);

  return (
    <svg width={width} height={GRAPH_H} style={{ display: 'block' }} aria-hidden="true">
      {gridLines}

      {teeth.map((fdi, index) => {
        const shape = getToothShape(fdi);
        const cx = g.toothX(index, teeth.length) + TOOTH_W / 2;
        const odonto = odontoMap[fdi];
        const probeable = isProbeable(odonto);
        const implant = isImplant(odonto);
        return (
          <g
            key={fdi}
            transform={`translate(${cx} ${cej}) scale(${SHAPE_SCALE} ${flip}) translate(-20 ${-shape.yCervix})`}
            opacity={probeable ? 1 : 0.35}
          >
            {shape.roots.map((d) => (
              <path
                key={d}
                d={d}
                fill={probeable ? (implant && implantFill) || toothFill : 'none'}
                stroke={toothStroke}
                strokeWidth={0.8 / SHAPE_SCALE}
                strokeDasharray={probeable ? undefined : '2 2'}
              />
            ))}
            <path
              d={shape.crown}
              fill={probeable ? toothFill : 'none'}
              stroke={toothStroke}
              strokeWidth={0.8 / SHAPE_SCALE}
              strokeDasharray={probeable ? undefined : '2 2'}
            />
          </g>
        );
      })}

      {/* CEJ reference */}
      <line
        x1={0}
        x2={width}
        y1={cej}
        y2={cej}
        stroke={theme.palette.text.disabled}
        strokeWidth={1}
        strokeDasharray="4 3"
      />

      {runs.map((run) => {
        const head = run[0].key;
        const margin = run.map((p) => `${p.x},${p.gmY}`).join(' ');
        const pocket = run.map((p) => `${p.x},${p.pocketY}`).join(' ');
        const area = `${margin} ${[...run].reverse().map((p) => `${p.x},${p.pocketY}`).join(' ')}`;
        return (
          <Fragment key={head}>
            <polygon points={area} fill={alpha(pocketColor, 0.16)} stroke="none" />
            {run.length > 1 && (
              <>
                <polyline points={margin} fill="none" stroke={marginColor} strokeWidth={1.6} />
                <polyline points={pocket} fill="none" stroke={pocketColor} strokeWidth={1.6} />
              </>
            )}
            {run.map((p) => {
              const severity = pdSeverity(p.site.pd);
              let dot = alpha(pocketColor, 0.55);
              if (severity === 'alert') dot = pocketColor;
              else if (severity === 'warn') dot = theme.palette.warning.main;
              return (
                <g key={p.key}>
                  {run.length === 1 && (
                    <line x1={p.x} x2={p.x} y1={p.gmY} y2={p.pocketY} stroke={pocketColor} strokeWidth={1.6} />
                  )}
                  <circle cx={p.x} cy={p.pocketY} r={severity ? 2.8 : 2} fill={dot} />
                  {p.site.bop && (
                    <circle
                      cx={p.x}
                      cy={p.gmY}
                      r={3.2}
                      fill={theme.palette.error.main}
                      stroke={theme.palette.background.paper}
                      strokeWidth={1}
                    />
                  )}
                  {p.site.sup && (
                    <circle
                      cx={p.x}
                      cy={p.gmY}
                      r={5.2}
                      fill="none"
                      stroke={theme.palette.warning.main}
                      strokeWidth={1.4}
                    />
                  )}
                </g>
              );
            })}
          </Fragment>
        );
      })}
    </svg>
  );
}

PerioGraph.propTypes = {
  arch: PropTypes.oneOf(['upper', 'lower']).isRequired,
  side: PropTypes.oneOf(['buccal', 'lingual']).isRequired,
  teeth: PropTypes.arrayOf(PropTypes.number).isRequired,
  draft: PropTypes.object.isRequired,
  odontoMap: PropTypes.object.isRequired,
};

export default memo(PerioGraph);

// ── mm scale shown in the row-label column beside each graph ─────────────────
export function PerioGraphAxis({ arch, width }) {
  const theme = useTheme();
  const { GRAPH_H, mmToY } = usePerioGeometry();
  const ticks = [0, 5, 10, 15, 20].filter((mm) => {
    const y = mmToY(arch, mm);
    return y > 6 && y < GRAPH_H - 6;
  });
  return (
    <svg width={width} height={GRAPH_H} style={{ display: 'block' }} aria-hidden="true">
      {ticks.map((mm) => {
        const y = mmToY(arch, mm);
        return (
          <g key={mm}>
            <line x1={width - 8} x2={width} y1={y} y2={y} stroke={theme.palette.text.disabled} />
            <text
              x={width - 11}
              y={y + 3.5}
              textAnchor="end"
              fontSize={10}
              fill={theme.palette.text.secondary}
            >
              {mm === 0 ? 'CEJ' : `${mm}`}
            </text>
          </g>
        );
      })}
      <text x={4} y={arch === 'upper' ? 12 : GRAPH_H - 5} fontSize={9} fill={theme.palette.text.disabled}>
        mm
      </text>
    </svg>
  );
}

PerioGraphAxis.propTypes = {
  arch: PropTypes.oneOf(['upper', 'lower']).isRequired,
  width: PropTypes.number.isRequired,
};

