import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

/**
 * A labelled group of form fields.
 *
 * A long form read as one undifferentiated wall of inputs — fourteen fields under a single card
 * with nothing saying which belong together. Grouping them lets someone find the two they came
 * to change without reading all fourteen.
 *
 * `caption` is for the note that applies to the whole group rather than to one field: the
 * 24-hour rule belongs to the opening-hours pair, not dangling under the end-time input.
 */
export default function FormSection({ title, caption, action, children, sx }) {
  return (
    <Stack spacing={2} sx={sx}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2">{title}</Typography>
          {caption && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {caption}
            </Typography>
          )}
        </Stack>

        {action}
      </Stack>

      {children}
    </Stack>
  );
}

FormSection.propTypes = {
  title: PropTypes.node,
  caption: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node,
  sx: PropTypes.object,
};

/**
 * Two columns on a wide screen, one on a phone.
 *
 * Shared rather than repeated per form so the column gap stays the same everywhere — the gutters
 * being subtly different between two cards on the same page is the kind of thing that reads as
 * unfinished without anyone being able to say why.
 */
export const twoCol = {
  rowGap: 2.5,
  columnGap: 2,
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
};

/** A single full-width row inside a `twoCol` grid — for an address or a long URL. */
export const fullWidth = { gridColumn: { sm: '1 / -1' } };

/** Wraps children in the two-column grid without the caller importing Box. */
export function FormGrid({ children, sx }) {
  return <Box sx={{ ...twoCol, ...sx }}>{children}</Box>;
}

FormGrid.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
