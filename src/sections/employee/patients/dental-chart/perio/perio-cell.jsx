import PropTypes from 'prop-types';
import { memo, useState, useEffect } from 'react';

import { alpha, useTheme } from '@mui/material/styles';

import { usePerioGeometry } from './perio-layout';

const ARROWS = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };

/**
 * One measurement cell (PD or GM) for one probing site.
 *
 * A plain <input>: the chart holds a few hundred of them, and a full MUI
 * TextField each would be far heavier than a clinical grid needs.
 *
 * PD entry is built for speed: a single digit 2–9 is committed and the cursor
 * jumps to the next site; "1" waits for a second digit (10–15) or Enter/→.
 * GM accepts a leading "-" (enlargement) and does not auto-advance.
 * In any cell, "b" toggles bleeding and "s" suppuration for that site.
 */
function PerioCell({
  kind,
  value,
  disabled,
  readOnly,
  severity,
  inputRef,
  label,
  onCommit,
  onToggle,
  onNavigate,
  onAdvance,
}) {
  const theme = useTheme();
  const { CELL_W, ROW_H, FONT } = usePerioGeometry();
  const shown = value === null || value === undefined ? '' : String(value);
  // GM needs a local draft so a lone "-" can be typed before its digits.
  const [text, setText] = useState(shown);
  useEffect(() => setText(shown), [shown]);

  const handleChange = (event) => {
    const raw = event.target.value;

    if (kind === 'pd') {
      const digits = raw.replace(/\D/g, '').slice(0, 2);
      if (!digits) {
        onCommit(null);
        return;
      }
      onCommit(Number(digits));
      if (digits.length === 2 || digits !== '1') onAdvance();
      return;
    }

    if (!/^-?\d{0,2}$/.test(raw)) return;
    setText(raw);
    if (raw === '' ) onCommit(null);
    else if (raw !== '-') onCommit(Number(raw));
  };

  const handleKeyDown = (event) => {
    if (ARROWS[event.key]) {
      event.preventDefault();
      onNavigate(ARROWS[event.key]);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      onAdvance();
    } else if (event.key === 'b' || event.key === 'B') {
      event.preventDefault();
      onToggle('bop');
    } else if (event.key === 's' || event.key === 'S') {
      event.preventDefault();
      onToggle('sup');
    }
  };

  let color = theme.palette.text.primary;
  if (severity === 'alert') color = theme.palette.error.main;
  else if (severity === 'warn') color = theme.palette.warning.dark;

  return (
    <input
      ref={inputRef}
      value={kind === 'gm' ? text : shown}
      disabled={disabled}
      readOnly={readOnly}
      inputMode="numeric"
      autoComplete="off"
      aria-label={label}
      title={label}
      onFocus={(e) => e.target.select()}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      style={{
        width: CELL_W,
        height: ROW_H - 4,
        padding: 0,
        margin: 0,
        border: `1px solid ${disabled ? 'transparent' : theme.palette.divider}`,
        borderRadius: 4,
        textAlign: 'center',
        fontSize: FONT,
        fontWeight: severity ? 700 : 500,
        fontFamily: 'inherit',
        color,
        backgroundColor: (() => {
          if (disabled) return 'transparent';
          if (severity === 'alert') return alpha(theme.palette.error.main, 0.12);
          if (severity === 'warn') return alpha(theme.palette.warning.main, 0.14);
          return theme.palette.background.paper;
        })(),
        outline: 'none',
        cursor: readOnly || disabled ? 'default' : 'text',
      }}
    />
  );
}

PerioCell.propTypes = {
  kind: PropTypes.oneOf(['pd', 'gm']).isRequired,
  value: PropTypes.number,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  severity: PropTypes.oneOf([null, 'warn', 'alert']),
  inputRef: PropTypes.func,
  label: PropTypes.string,
  onCommit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onAdvance: PropTypes.func.isRequired,
};

export default memo(PerioCell);
