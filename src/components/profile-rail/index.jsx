import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER } from 'src/layouts/config-layout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ProfileTabs from 'src/components/profile-tabs';

// ----------------------------------------------------------------------

// A vertical, grouped section switcher for a record with more sections than a
// tab bar can hold. Below `md` there is no room for a rail, so it falls back to
// ProfileTabs -- which already wraps rather than scrolls, because MUI's
// scrollable tab arrows are broken in RTL.
export default function ProfileRail({
  pinned = [],
  sections = [],
  value,
  onChange,
  collapsed = false,
  onToggleCollapse,
  width = 248,
  collapsedWidth = 76,
  collapseLabel,
  expandLabel,
  sx,
  ...other
}) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const isRtl = theme.direction === 'rtl';

  // A group whose items were all filtered out (a med lab has no prescriptions,
  // say) must not leave its heading behind.
  const visibleSections = sections.filter((section) => section.items?.length);

  if (!mdUp) {
    const flat = [...pinned, ...visibleSections.flatMap((section) => section.items)];
    return <ProfileTabs tabs={flat} value={value} onChange={onChange} sx={sx} {...other} />;
  }

  const renderItem = (item) => {
    const selected = item.value === value;

    const button = (
      <ListItemButton
        key={item.value}
        selected={selected}
        onClick={() => onChange(item.value)}
        sx={{
          px: collapsed ? 0 : 1.5,
          py: 1,
          gap: 1.5,
          minHeight: 44,
          borderRadius: 1,
          color: 'text.secondary',
          typography: 'body2',
          fontWeight: 500,
          justifyContent: collapsed ? 'center' : 'flex-start',
          // The active marker is a soft tint plus an inline-start bar, not an
          // underline: some panes carry their own underlined tab strip inside,
          // and a different idiom keeps those from reading as peers of the rail.
          borderInlineStart: '3px solid transparent',
          '&:hover': { color: 'text.primary' },
          '&.Mui-selected': {
            color: 'primary.main',
            fontWeight: 600,
            borderInlineStartColor: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) },
          },
        }}
      >
        {item.icon && <Iconify icon={item.icon} width={22} sx={{ flexShrink: 0 }} />}

        {!collapsed && (
          <Box
            component="span"
            sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {item.label}
          </Box>
        )}
      </ListItemButton>
    );

    // Collapsed, the label itself has to become the tooltip or the rail is
    // unreadable. Tooltip placement is one of the few things emotion's RTL
    // plugin cannot mirror, so it is chosen explicitly.
    const title = collapsed ? item.label : item.tooltip;

    return title ? (
      <Tooltip key={item.value} title={title} placement={isRtl ? 'left' : 'right'} arrow>
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  return (
    <Card
      sx={{
        width: collapsed ? collapsedWidth : width,
        flexShrink: 0,
        position: 'sticky',
        top: HEADER.H_DESKTOP + 16,
        alignSelf: 'flex-start',
        maxHeight: `calc(100vh - ${HEADER.H_DESKTOP + 48}px)`,
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.shorter,
        }),
        ...sx,
      }}
      {...other}
    >
      <Scrollbar sx={{ flex: 1 }}>
        <Box sx={{ p: 1 }}>
          {pinned.map(renderItem)}

          {visibleSections.map((section) => (
            <Box key={section.key} sx={{ mt: 1 }}>
              {collapsed ? (
                <Divider sx={{ my: 1 }} />
              ) : (
                <Typography
                  variant="overline"
                  sx={{ display: 'block', px: 1.5, pt: 1, pb: 0.5, color: 'text.disabled' }}
                >
                  {section.label}
                </Typography>
              )}

              {section.items.map(renderItem)}
            </Box>
          ))}
        </Box>
      </Scrollbar>

      {onToggleCollapse && (
        <>
          <Divider />
          <Tooltip
            title={collapsed ? expandLabel : collapseLabel}
            placement={isRtl ? 'left' : 'right'}
            arrow
          >
            <ListItemButton
              onClick={onToggleCollapse}
              sx={{
                px: collapsed ? 0 : 2,
                py: 1,
                gap: 1.5,
                minHeight: 44,
                color: 'text.secondary',
                typography: 'caption',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              {/* Points away from the content when expanded, back toward it when
                  collapsed -- which swaps sides under RTL. */}
              <Iconify
                icon={
                  collapsed === isRtl
                    ? 'eva:arrow-ios-back-fill'
                    : 'eva:arrow-ios-forward-fill'
                }
                width={18}
                sx={{ flexShrink: 0 }}
              />
              {!collapsed && collapseLabel}
            </ListItemButton>
          </Tooltip>
        </>
      )}
    </Card>
  );
}

const itemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.node,
  icon: PropTypes.string,
  tooltip: PropTypes.node,
});

ProfileRail.propTypes = {
  pinned: PropTypes.arrayOf(itemShape),
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.node,
      items: PropTypes.arrayOf(itemShape),
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  width: PropTypes.number,
  collapsedWidth: PropTypes.number,
  collapseLabel: PropTypes.node,
  expandLabel: PropTypes.node,
  sx: PropTypes.object,
};
