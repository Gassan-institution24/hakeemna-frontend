import PropTypes from 'prop-types';
import { memo, useState } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Popover, Tooltip, TextField, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import PerioCell from './perio-cell';
import PerioGraph, { PerioGraphAxis } from './perio-graph';
import { pdSeverity, usePerioGeometry } from './perio-layout';
import { getToothType, getRootConfig } from '../constants/fdi';
import { calOf, isImplant, isProbeable, screenSiteOrder } from './perio-math';

// Same tooth-type colours as the odontogram's FDI row (odontogram-view.jsx), so
// both views read alike: incisor blue · canine red · premolar/molar green.
const NUMBER_COLORS = { incisor: '#1E88E5', canine: '#E53935', premolar: '#2E9E5B', molar: '#2E9E5B' };
const ROMAN = ['', 'I', 'II', 'III'];

// ── Row scaffolding ───────────────────────────────────────────────────────────
// Physical positions are set with inline `style`, never `sx`: stylis-plugin-rtl
// would otherwise flip left/right under the Arabic theme, and a dental chart's
// anatomy must not mirror.
function Row({ label, sublabel, height, teeth, children, shaded }) {
  const theme = useTheme();
  const { ROW_H, LABEL_W, TOOTH_W, MIDLINE_GAP } = usePerioGeometry();
  const half = teeth.length / 2;
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: height || ROW_H }}>
      <div
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 2,
          width: LABEL_W,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 8,
          paddingRight: 6,
          boxSizing: 'border-box',
          background: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        {typeof label === 'string' ? (
          <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1.1 }} noWrap>
            {label}
          </Typography>
        ) : (
          label
        )}
        {sublabel && (
          <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1.1 }} noWrap>
            {sublabel}
          </Typography>
        )}
      </div>
      {teeth.map((fdi, index) => (
        <div
          key={fdi}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: TOOTH_W,
            flexShrink: 0,
            marginLeft: index === half ? MIDLINE_GAP : 0,
            borderLeft: index === half ? `2px solid ${theme.palette.divider}` : undefined,
            background: shaded ? alpha(theme.palette.text.primary, 0.025) : undefined,
          }}
        >
          {children(fdi, index)}
        </div>
      ))}
    </div>
  );
}

Row.propTypes = {
  label: PropTypes.node,
  sublabel: PropTypes.string,
  height: PropTypes.number,
  teeth: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  shaded: PropTypes.bool,
};

// A value cycled 0 → 1 → 2 → 3 → 0 by clicking (shift-click steps back).
function GradeButton({ value, text, title, disabled, onChange }) {
  const theme = useTheme();
  const { ROW_H } = usePerioGeometry();
  const active = value > 0;
  return (
    <Tooltip title={title} placement="top" arrow disableInteractive>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => onChange(e.shiftKey ? (value + 3) % 4 : (value + 1) % 4)}
        style={{
          minWidth: 30,
          height: ROW_H - 6,
          padding: '0 4px',
          border: `1px solid ${active ? theme.palette.warning.main : theme.palette.divider}`,
          borderRadius: 4,
          background: active ? alpha(theme.palette.warning.main, 0.16) : 'transparent',
          color: active ? theme.palette.warning.dark : theme.palette.text.disabled,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {active ? text : '·'}
      </button>
    </Tooltip>
  );
}

GradeButton.propTypes = {
  value: PropTypes.number,
  text: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

// Bleeding (red) and suppuration (amber) toggles for one site.
function SiteFlags({ site, disabled, onToggle, t }) {
  const theme = useTheme();
  const { CELL_W } = usePerioGeometry();
  const charted = !!site?.pd;
  const dot = (flag, color, title) => {
    const on = !!site?.[flag];
    return (
      <button
        type="button"
        aria-label={title}
        aria-pressed={on}
        title={title}
        disabled={disabled || !charted}
        onClick={() => onToggle(flag)}
        style={{
          width: 9,
          height: 9,
          padding: 0,
          borderRadius: '50%',
          border: `1.5px solid ${charted ? color : theme.palette.divider}`,
          background: on ? color : 'transparent',
          cursor: disabled || !charted ? 'default' : 'pointer',
          opacity: charted ? 1 : 0.4,
        }}
      />
    );
  };
  return (
    <div style={{ width: CELL_W, display: 'flex', justifyContent: 'center', gap: 2 }}>
      {dot('bop', theme.palette.error.main, t('Bleeding on Probing'))}
      {dot('sup', theme.palette.warning.main, t('Suppuration'))}
    </div>
  );
}

SiteFlags.propTypes = {
  site: PropTypes.object,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

// ── One arch ──────────────────────────────────────────────────────────────────

function PerioArch({ arch, teeth, draft, odontoMap, readOnly, actions, nav }) {
  const theme = useTheme();
  const { CELL_W, LABEL_W, ROW_H, FONT } = usePerioGeometry();
  const { t } = useTranslate();
  const [notesAnchor, setNotesAnchor] = useState(null); // { el, fdi }

  const lingualName = arch === 'upper' ? t('Palatal') : t('Lingual');
  const sideName = (side) => (side === 'buccal' ? t('Buccal') : lingualName);
  const toothOf = (fdi) => draft[fdi] || {};
  const probeableOf = (fdi) => isProbeable(odontoMap[fdi]);

  // ── Header rows: number, mobility, furcation, plaque ───────────────────────
  const numberRow = (
    <Row key="num" label={t('Tooth')} teeth={teeth} height={ROW_H + 6}>
      {(fdi) => {
        const odonto = odontoMap[fdi];
        const probeable = probeableOf(fdi);
        const hasNotes = !!toothOf(fdi).notes;
        return (
          <button
            type="button"
            onClick={(e) => setNotesAnchor({ el: e.currentTarget, fdi })}
            title={t('Tooth notes')}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 4px',
              fontFamily: 'inherit',
            }}
          >
            <span
              style={{
                fontSize: FONT + 1,
                fontWeight: 800,
                color: probeable ? NUMBER_COLORS[getToothType(fdi)] : theme.palette.text.disabled,
                textDecoration: probeable ? 'none' : 'line-through',
              }}
            >
              {fdi}
            </span>
            {isImplant(odonto) && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '0 3px',
                  borderRadius: 3,
                  color: theme.palette.info.dark,
                  background: alpha(theme.palette.info.main, 0.16),
                }}
              >
                {t('IMP')}
              </span>
            )}
            {hasNotes && (
              <span
                style={{ width: 6, height: 6, borderRadius: '50%', background: theme.palette.primary.main }}
              />
            )}
          </button>
        );
      }}
    </Row>
  );

  const mobilityRow = (
    <Row key="mob" label={t('Mobility')} teeth={teeth} shaded>
      {(fdi) => (
        <GradeButton
          value={toothOf(fdi).mobility_grade || 0}
          text={`M${toothOf(fdi).mobility_grade || 0}`}
          title={`${t('Mobility')} (0–3)`}
          disabled={readOnly || !probeableOf(fdi)}
          onChange={(v) => actions.setToothField(fdi, 'mobility_grade', v)}
        />
      )}
    </Row>
  );

  const furcationRow = (
    <Row key="fur" label={t('Furcation')} teeth={teeth} shaded>
      {(fdi) =>
        getRootConfig(fdi).count > 1 ? (
          <GradeButton
            value={toothOf(fdi).furcation_grade || 0}
            text={`F${ROMAN[toothOf(fdi).furcation_grade || 0]}`}
            title={`${t('Furcation')} (I–III)`}
            disabled={readOnly || !probeableOf(fdi) || isImplant(odontoMap[fdi])}
            onChange={(v) => actions.setToothField(fdi, 'furcation_grade', v)}
          />
        ) : null
      }
    </Row>
  );

  const plaqueRow = (
    <Row key="plq" label={t('Plaque')} teeth={teeth} shaded>
      {(fdi) => {
        const on = !!toothOf(fdi).plaque;
        const disabled = readOnly || !probeableOf(fdi);
        return (
          <button
            type="button"
            aria-pressed={on}
            title={t('Plaque')}
            disabled={disabled}
            onClick={() => actions.setToothField(fdi, 'plaque', !on)}
            style={{
              width: 14,
              height: 14,
              padding: 0,
              borderRadius: 3,
              border: `1.5px solid ${probeableOf(fdi) ? theme.palette.info.main : theme.palette.divider}`,
              background: on ? theme.palette.info.main : 'transparent',
              cursor: disabled ? 'default' : 'pointer',
            }}
          />
        );
      }}
    </Row>
  );

  const header = [numberRow, mobilityRow, furcationRow, plaqueRow];

  // ── Side rows ───────────────────────────────────────────────────────────────
  const siteCells = (side, fdi, index, render) =>
    screenSiteOrder(fdi, side).map((key, k) => (
      <div key={key} style={{ width: CELL_W, display: 'flex', justifyContent: 'center' }}>
        {render(key, index * 3 + k)}
      </div>
    ));

  const inputRow = (side, kind) => {
    const rowId = `${arch}-${side}-${kind}`;
    return (
      <Row
        key={rowId}
        label={kind === 'pd' ? t('PD') : t('GM')}
        sublabel={sideName(side)}
        teeth={teeth}
      >
        {(fdi, index) =>
          siteCells(side, fdi, index, (key, col) => {
            const site = toothOf(fdi).sites?.[key];
            const probeable = probeableOf(fdi);
            const value = kind === 'pd' ? site?.pd : site?.gm;
            return (
              <PerioCell
                kind={kind}
                value={value ?? null}
                // GM belongs to a probed site; it opens once PD is entered.
                disabled={!probeable || (kind === 'gm' && !site?.pd)}
                readOnly={readOnly}
                severity={kind === 'pd' ? pdSeverity(site?.pd) : null}
                inputRef={nav.register(rowId, col)}
                label={`${fdi} ${key} ${kind === 'pd' ? t('Pocket Depth') : t('Gingival Margin')}`}
                onCommit={(v) =>
                  kind === 'pd' ? actions.setPd(fdi, key, v) : actions.setGm(fdi, key, v)
                }
                onToggle={(flag) => actions.toggleSiteFlag(fdi, key, flag)}
                onNavigate={(dir) => nav.move(rowId, col, dir)}
                onAdvance={() => nav.advance(rowId, col)}
              />
            );
          })
        }
      </Row>
    );
  };

  const calRow = (side) => (
    <Row key={`${side}-cal`} label={t('CAL')} sublabel={sideName(side)} teeth={teeth} shaded>
      {(fdi, index) =>
        siteCells(side, fdi, index, (key) => {
          const cal = probeableOf(fdi) ? calOf(toothOf(fdi).sites?.[key]) : null;
          return (
            <span
              style={{
                fontSize: FONT - 1,
                fontWeight: cal >= 5 ? 700 : 500,
                color: cal >= 5 ? theme.palette.error.main : theme.palette.text.secondary,
              }}
            >
              {cal ?? ''}
            </span>
          );
        })
      }
    </Row>
  );

  const flagsRow = (side) => (
    <Row key={`${side}-flags`} label={`${t('BOP')} · ${t('SUP')}`} sublabel={sideName(side)} teeth={teeth}>
      {(fdi, index) =>
        siteCells(side, fdi, index, (key) => (
          <SiteFlags
            site={probeableOf(fdi) ? toothOf(fdi).sites?.[key] : null}
            disabled={readOnly || !probeableOf(fdi)}
            onToggle={(flag) => actions.toggleSiteFlag(fdi, key, flag)}
            t={t}
          />
        ))
      }
    </Row>
  );

  const graph = (side) => (
    <div key={`${side}-graph`} style={{ display: 'flex' }}>
      <div
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 2,
          width: LABEL_W,
          flexShrink: 0,
          background: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <PerioGraphAxis arch={arch} width={LABEL_W - 1} />
      </div>
      <PerioGraph arch={arch} side={side} teeth={teeth} draft={draft} odontoMap={odontoMap} />
    </div>
  );

  // Outer side rows read outward-in (CAL, GM, PD, flags) above the graphs and
  // inward-out below them, so PD always sits next to the drawing it describes.
  const sideAbove = (side) => [calRow(side), inputRow(side, 'gm'), inputRow(side, 'pd'), flagsRow(side)];
  const sideBelow = (side) => [flagsRow(side), inputRow(side, 'pd'), inputRow(side, 'gm'), calRow(side)];

  const body =
    arch === 'upper'
      ? [...header, ...sideAbove('buccal'), graph('buccal'), graph('lingual'), ...sideBelow('lingual')]
      : [...sideAbove('lingual'), graph('lingual'), graph('buccal'), ...sideBelow('buccal'), ...header.reverse()];

  const notesTooth = notesAnchor ? toothOf(notesAnchor.fdi) : null;

  return (
    <>
      {body}

      <Popover
        open={!!notesAnchor}
        anchorEl={notesAnchor?.el}
        onClose={() => setNotesAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {notesAnchor && (
          <Box sx={{ p: 2, width: 280 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('Tooth')} {notesAnchor.fdi} — {t('Periodontal notes')}
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              size="small"
              autoFocus={!readOnly}
              value={notesTooth?.notes || ''}
              InputProps={{ readOnly }}
              placeholder={readOnly ? '' : t('Notes for this tooth')}
              onChange={(e) => actions.setToothField(notesAnchor.fdi, 'notes', e.target.value)}
            />
          </Box>
        )}
      </Popover>
    </>
  );
}

PerioArch.propTypes = {
  arch: PropTypes.oneOf(['upper', 'lower']).isRequired,
  teeth: PropTypes.arrayOf(PropTypes.number).isRequired,
  draft: PropTypes.object.isRequired,
  odontoMap: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  actions: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
};

export default memo(PerioArch);
