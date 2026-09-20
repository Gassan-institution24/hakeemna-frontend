import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Alert,
  Stack,
  Button,
  Divider,
  Collapse,
  Skeleton,
  Typography,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// The frame every record section of the patient chart renders inside.
//
// The sections used to be fifteen copies of the same JSX, and each copy had
// dropped something: no heading (so only the rail told you where you were), no
// loading state and no empty state (so `data?.map()` over nothing rendered a
// blank page -- indistinguishable from still-fetching or broken), and a primary
// button whose label flipped to a literal "X" to mean cancel.
//
// Panes bring their own record cards; this supplies only what was missing
// around them, so nothing here wraps children in another Card.
export default function ProfilePane({
  icon,
  title,
  subtitle,
  count,
  loading,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
  addLabel,
  adding,
  onToggleAdd,
  form,
  action,
  toolbar,
  children,
}) {
  const theme = useTheme();
  const { t } = useTranslate();

  // Adding and cancelling are different kinds of act, so they do not share a
  // look: the call to action is filled, backing out of it is not.
  const renderAction =
    action ??
    (onToggleAdd ? (
      <Button
        variant={adding ? 'outlined' : 'contained'}
        color={adding ? 'inherit' : 'primary'}
        onClick={onToggleAdd}
        startIcon={<Iconify icon={adding ? 'eva:close-fill' : 'mingcute:add-line'} />}
      >
        {adding ? t('Cancel') : addLabel}
      </Button>
    ) : null);

  const renderHeader = (
    <ProfilePaneHeader
      icon={icon}
      title={title}
      subtitle={subtitle}
      count={loading ? undefined : count}
      action={renderAction}
    />
  );

  const renderLoading = (
    <Stack gap={2}>
      {[0, 1, 2].map((row) => (
        <Card key={row} sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <Skeleton variant="text" width={180} height={28} />
            <Skeleton variant="rounded" width={72} height={28} />
          </Stack>
          <Skeleton variant="text" width="90%" sx={{ mt: 1.5 }} />
          <Skeleton variant="text" width="65%" />
        </Card>
      ))}
    </Stack>
  );

  // The section's own icon, oversized and faded -- the same mark the rail item
  // carries, so an empty pane still reads as the place you meant to open.
  const renderEmpty = (
    <Card
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        boxShadow: 'none',
        borderRadius: 2,
        border: `dashed 1px ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.grey[500], 0.04),
      }}
    >
      {icon && (
        <Iconify icon={icon} width={56} sx={{ color: 'text.disabled', opacity: 0.4, mb: 2 }} />
      )}

      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        {emptyTitle || t('No records yet')}
      </Typography>

      {emptyDescription && (
        <Typography
          variant="body2"
          sx={{ mt: 0.5, mx: 'auto', maxWidth: 420, color: 'text.disabled' }}
        >
          {emptyDescription}
        </Typography>
      )}

      {/* Repeated here so an empty section carries its next step in the middle
          of the page, not only in the corner. */}
      {onToggleAdd && addLabel && (
        <Button
          variant="contained"
          onClick={onToggleAdd}
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ mt: 3 }}
        >
          {addLabel}
        </Button>
      )}
    </Card>
  );

  const renderBody = () => {
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || t('Something went wrong')}
        </Alert>
      );
    }

    if (loading) return renderLoading;

    // While the form is open the empty state would only argue with it.
    if (isEmpty) return adding ? null : renderEmpty;

    return children;
  };

  return (
    <Box>
      {renderHeader}

      {/* Sub-navigation or filters belonging to this section, between the
          heading and the records it scopes. */}
      {toolbar && <Box sx={{ mb: 2.5 }}>{toolbar}</Box>}

      {form && (
        <Collapse in={!!adding} unmountOnExit>
          <Box sx={{ mb: 2 }}>{form}</Box>
          <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        </Collapse>
      )}

      {renderBody()}
    </Box>
  );
}

ProfilePane.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  count: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.object,
  isEmpty: PropTypes.bool,
  emptyTitle: PropTypes.node,
  emptyDescription: PropTypes.node,
  addLabel: PropTypes.node,
  adding: PropTypes.bool,
  onToggleAdd: PropTypes.func,
  form: PropTypes.node,
  action: PropTypes.node,
  toolbar: PropTypes.node,
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

// Exported on its own for the sections that already own their layout -- the
// appointments table, the upload manager, the edit form. They keep their
// internals and borrow only the heading, so every section of the chart names
// itself the same way.
export function ProfilePaneHeader({ icon, title, subtitle, count, action, sx }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      sx={{ mb: 2.5, ...sx }}
    >
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
        {icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 1.25,
              display: 'grid',
              placeItems: 'center',
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Iconify icon={icon} width={22} />
          </Box>
        )}

        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
              {title}
            </Typography>

            {/* Only ever a real number. A zero is already said, and said better,
                by the empty state below it. */}
            {count > 0 && (
              <Label variant="soft" color="default">
                {count}
              </Label>
            )}
          </Stack>

          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>

      {action}
    </Stack>
  );
}

ProfilePaneHeader.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  count: PropTypes.number,
  action: PropTypes.node,
  sx: PropTypes.object,
};
