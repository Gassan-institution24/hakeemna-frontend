import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Avatar, Tooltip, Skeleton, Typography } from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

/** First letters of the first two words — the fallback when there is no photo. */
const getInitials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

// The identity strip above a profile: who or what this record is, and the handful of facts
// someone needs to confirm they are looking at the right one.
//
// Generic on purpose. The patient profile has its own banner because a patient carries clinical
// facts that nothing else does; an employee and a clinic just need a photo, a name, a subtitle
// and a row of chips, and two near-identical banners would drift apart.
//
// Every field is omitted when absent rather than shown as a dash, so a sparse record reads as
// short rather than as broken.
export default function IdentityBanner({
  name,
  subtitle,
  avatar,
  icon,
  facts = [],
  status,
  actions,
  loading,
}) {
  const theme = useTheme();

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={64} height={64} />
          <Stack gap={1} sx={{ flex: 1 }}>
            <Skeleton variant="text" width={220} height={32} />
            <Skeleton variant="text" width={320} height={20} />
          </Stack>
        </Stack>
      </Card>
    );
  }

  const visible = facts.filter((fact) => fact && fact.label);

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <Stack direction="row" alignItems="flex-start" gap={1.5} sx={{ minWidth: 0 }}>
          <Avatar
            src={avatar}
            alt={name}
            sx={{
              width: 64,
              height: 64,
              flexShrink: 0,
              bgcolor: alpha(theme.palette.primary.main, 0.16),
              color: 'primary.dark',
              fontWeight: 600,
            }}
          >
            {/* An icon reads better than initials for a place; a person gets initials. */}
            {icon ? <Iconify icon={icon} width={30} /> : getInitials(name)}
          </Avatar>

          <Stack gap={0.75} sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
                {name}
              </Typography>

              {status}
            </Stack>

            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}

            {visible.length > 0 && (
              <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
                {visible.map((fact) => {
                  const chip = (
                    <Label key={fact.key} color={fact.color || 'default'} variant="soft">
                      {fact.icon && (
                        <Iconify icon={fact.icon} width={14} sx={{ mr: 0.5, flexShrink: 0 }} />
                      )}
                      <Box component="span" dir={fact.dir}>
                        {fact.label}
                      </Box>
                    </Label>
                  );

                  return fact.tooltip ? (
                    <Tooltip key={fact.key} title={fact.tooltip}>
                      <Box sx={{ display: 'flex' }}>{chip}</Box>
                    </Tooltip>
                  ) : (
                    chip
                  );
                })}
              </Stack>
            )}
          </Stack>
        </Stack>

        {actions && (
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            sx={{
              ml: 'auto',
              width: { xs: 1, sm: 'auto' },
              // On a phone the buttons split the row evenly rather than wrapping one under the
              // other at ragged widths.
              '& > *': { flex: { xs: 1, sm: 'none' } },
            }}
          >
            {actions}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

IdentityBanner.propTypes = {
  name: PropTypes.node,
  subtitle: PropTypes.node,
  avatar: PropTypes.string,
  icon: PropTypes.string,
  facts: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.node,
      icon: PropTypes.string,
      color: PropTypes.string,
      dir: PropTypes.string,
      tooltip: PropTypes.node,
    })
  ),
  status: PropTypes.node,
  actions: PropTypes.node,
  loading: PropTypes.bool,
};
