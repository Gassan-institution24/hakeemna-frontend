// Visual language adopted from React Odontogram Modul.
//
// Source: https://github.com/ZoliQua/React-Odontogram-Modul
// Copyright (c) Zoltán Dul — MIT licence.
//
// Only the presentation tokens are reused (its `--odon-*` custom properties and
// the tooth-tile treatment). None of its code runs here: the chart, its state,
// interactions and API calls remain Hakeemna's own.
//
// The package ships a single light palette. Hakeemna supports light and dark, so
// the dark column below is derived from those hues rather than copied, keeping
// the same accent identity without washing out in dark mode.
const LIGHT = {
  bg: '#f3f6fb',
  panel: '#ffffff',
  card: '#ffffff',
  muted: '#5b6b7d',
  text: '#1e2a3a',
  line: '#d7e0ec',
  accent: '#3b7bff',
  accent2: '#12b981',
  tile: 'rgba(255, 255, 255, 0.70)',
  tileHover: 'rgba(59, 123, 255, 0.06)',
};

const DARK = {
  bg: '#141a23',
  panel: '#1b232e',
  card: '#1b232e',
  muted: '#8fa0b4',
  text: '#e6edf6',
  line: '#2c3847',
  accent: '#5b92ff',
  accent2: '#2ecc9a',
  tile: 'rgba(255, 255, 255, 0.04)',
  tileHover: 'rgba(91, 146, 255, 0.10)',
};

export const getOdontogramPalette = (mode) => (mode === 'dark' ? DARK : LIGHT);

// The package's tooth tile: a soft rounded card with a hairline border that
// lifts slightly on hover. Selection/highlight rings are layered on top by
// SingleTooth so the existing selection behaviour is unchanged.
export const toothTileSx = (palette, { interactive = true } = {}) => ({
  border: '1px solid',
  borderColor: palette.line,
  borderRadius: '14px',
  backgroundColor: palette.tile,
  padding: '2px',
  transition: 'transform .05s ease, border-color .12s ease, background .12s ease',
  ...(interactive && {
    '&:hover': {
      borderColor: palette.accent,
      backgroundColor: palette.tileHover,
    },
    '&:active': { transform: 'translateY(1px)' },
  }),
});

export default getOdontogramPalette;
