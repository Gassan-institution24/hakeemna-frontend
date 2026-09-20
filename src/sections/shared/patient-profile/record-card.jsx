import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Chip, Stack, Divider, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// One record inside a chart section -- a sick leave, a report, a message.
//
// Two problems drove this shape. Every section had grown its own card and they
// disagreed on everything (`py: 3, px: 5` never shrank on a phone, the date sat
// on the start in some sections and on the end in others). And because each
// card was a full-width bar holding three short fields, a section with four
// records read as an empty page with four sparse stripes across it -- which is
// why the lists are gridded now rather than stacked.
//
// Spacing between cards belongs to the list, not the card, so nothing here sets
// a margin.
export default function RecordCard({
  title,
  subtitle,
  icon,
  color = 'primary',
  badge,
  actions,
  footer,
  children,
  sx,
}) {
  const theme = useTheme();
  const tint = theme.palette[color] || theme.palette.primary;

  return (
    <Card
      sx={{
        p: { xs: 2, md: 2.5 },
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create(['box-shadow', 'border-color'], {
          duration: theme.transitions.duration.shorter,
        }),
        border: `solid 1px ${theme.palette.divider}`,
        '&:hover': {
          boxShadow: theme.customShadows.z8,
          borderColor: alpha(tint.main, 0.32),
        },
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="flex-start" gap={1.5}>
        {icon && (
          // A tinted tile rather than a bare 16px glyph: it gives the card a
          // fixed visual anchor, so a short record still reads as a designed
          // object instead of a line of text floating on white.
          <Box
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: 1,
              display: 'grid',
              placeItems: 'center',
              color: `${color}.main`,
              bgcolor: alpha(tint.main, 0.1),
            }}
          >
            <Iconify icon={icon} width={20} />
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
              {title}
            </Typography>
            {badge}
          </Stack>

          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Stack direction="row" alignItems="center" sx={{ flexShrink: 0, mt: -0.5, mr: -0.5 }}>
            {actions}
          </Stack>
        )}
      </Stack>

      {children && <Box sx={{ mt: 2, flex: 1, minWidth: 0 }}>{children}</Box>}

      {footer && (
        <>
          <Divider sx={{ mt: 2, borderStyle: 'dashed' }} />
          <Box sx={{ pt: 1.5 }}>{footer}</Box>
        </>
      )}
    </Card>
  );
}

RecordCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  icon: PropTypes.string,
  color: PropTypes.string,
  badge: PropTypes.node,
  actions: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

// Records laid out across the pane instead of down it. `auto-fill` means the
// column count follows the available width rather than a breakpoint guess, so
// the same list works beside an expanded rail, a collapsed one, and on a phone.
//
// `align-items: start` keeps a card with a long description from stretching
// every other card in its row to match.
export function RecordGrid({ children, min = 340, sx }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))`,
        gap: 2,
        alignItems: 'start',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

RecordGrid.propTypes = { children: PropTypes.node, min: PropTypes.number, sx: PropTypes.object };

// ----------------------------------------------------------------------

// For prose and rich text, which needs the full width rather than a narrow
// value column beside its label.
export function RecordBlock({ label, children, sx }) {
  return (
    <Box sx={{ gridColumn: '1 / -1', minWidth: 0, ...sx }}>
      {label && (
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
      )}

      <Box
        sx={{
          typography: 'body2',
          wordBreak: 'break-word',
          // Rich text arrives as HTML carrying its own paragraph margins, which
          // otherwise push the card open at the top and bottom.
          '& > :first-of-type': { mt: 0 },
          '& > :last-child': { mb: 0 },
          '& p': { my: 0.5 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

RecordBlock.propTypes = { label: PropTypes.node, children: PropTypes.node, sx: PropTypes.object };

// ----------------------------------------------------------------------

// The one number a record is really about -- how many days of leave, how many
// medicines. Gives an otherwise text-only card something to land on.
export function RecordStat({ value, unit, label, color = 'text.primary' }) {
  return (
    <Box>
      <Stack direction="row" alignItems="baseline" gap={0.5}>
        <Typography variant="h5" sx={{ color, lineHeight: 1.2 }}>
          {value}
        </Typography>

        {unit && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {unit}
          </Typography>
        )}
      </Stack>

      {label && (
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {label}
        </Typography>
      )}
    </Box>
  );
}

RecordStat.propTypes = {
  value: PropTypes.node,
  unit: PropTypes.node,
  label: PropTypes.node,
  color: PropTypes.string,
};

// ----------------------------------------------------------------------

// Attachments were bare blue links in a row, with nothing marking them as files
// and no key on the map.
export function RecordAttachments({ files, fallbackLabel }) {
  const list = Array.isArray(files) ? files.filter(Boolean) : [];

  if (!list.length) return null;

  return (
    <Stack direction="row" flexWrap="wrap" gap={0.75}>
      {list.map((file, index) => (
        <Chip
          key={file?.name || file || index}
          size="small"
          variant="outlined"
          clickable
          component="a"
          href={file}
          target="_blank"
          rel="noopener"
          icon={<Iconify icon="solar:paperclip-bold" width={14} />}
          label={file?.name || fallbackLabel}
          sx={{ maxWidth: 220 }}
        />
      ))}
    </Stack>
  );
}

RecordAttachments.propTypes = { files: PropTypes.array, fallbackLabel: PropTypes.node };
