import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER } from 'src/layouts/config-layout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

// A vertical, grouped section switcher for a record with more sections than a
// tab bar can hold.
//
// Below `md` there is no room for a rail beside the content, and a tab bar is
// no answer either: fifteen sections wrap to six or seven rows on a phone, so
// a third of the screen is spent on navigation before any record shows. So the
// small-screen form is a single trigger row that opens the same grouped list in
// a drawer -- identical grouping, identical items, one row of chrome.
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
  browseLabel,
  sx,
  ...other
}) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const isRtl = theme.direction === 'rtl';

  const [open, setOpen] = useState(false);

  // A group whose items were all filtered out (a med lab has no prescriptions,
  // say) must not leave its heading behind.
  const visibleSections = sections.filter((section) => section.items?.length);

  const allItems = [...pinned, ...visibleSections.flatMap((section) => section.items)];
  const current = allItems.find((item) => item.value === value);

  // Collapsed only ever applies to the desktop rail; inside the drawer every
  // item shows its label.
  const renderItem = (item, { compact = collapsed } = {}) => {
    const selected = item.value === value;

    const button = (
      <ListItemButton
        key={item.value}
        selected={selected}
        onClick={() => {
          onChange(item.value);
          setOpen(false);
        }}
        sx={{
          px: compact ? 0 : 1.5,
          py: 1,
          gap: 1.5,
          minHeight: 44,
          borderRadius: 1,
          color: 'text.secondary',
          typography: 'body2',
          fontWeight: 500,
          justifyContent: compact ? 'center' : 'flex-start',
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

        {!compact && (
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
    const title = compact ? item.label : item.tooltip;

    return title ? (
      <Tooltip key={item.value} title={title} placement={isRtl ? 'left' : 'right'} arrow>
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  const renderList = (options) => (
    <Box sx={{ p: 1 }}>
      {pinned.map((item) => renderItem(item, options))}

      {visibleSections.map((section) => (
        <Box key={section.key} sx={{ mt: 1 }}>
          {options?.compact ? (
            <Divider sx={{ my: 1 }} />
          ) : (
            <Typography
              variant="overline"
              sx={{ display: 'block', px: 1.5, pt: 1, pb: 0.5, color: 'text.disabled' }}
            >
              {section.label}
            </Typography>
          )}

          {section.items.map((item) => renderItem(item, options))}
        </Box>
      ))}
    </Box>
  );

  if (!mdUp) {
    return (
      <>
        <Card sx={{ ...sx }} {...other}>
          <ListItemButton
            onClick={() => setOpen(true)}
            sx={{ py: 1.25, px: 2, gap: 1.5, minHeight: 52 }}
          >
            {current?.icon && (
              <Iconify icon={current.icon} width={22} sx={{ color: 'primary.main' }} />
            )}

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {current ? (
                <>
                  <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                    {browseLabel}
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    {current.label}
                  </Typography>
                </>
              ) : (
                // Some panes are reached from outside the rail -- Patient
                // Information opens from the banner -- so no item matches the
                // active section. Name the control rather than render blank.
                <Typography variant="subtitle2" noWrap>
                  {browseLabel}
                </Typography>
              )}
            </Box>

            <Iconify icon="eva:chevron-down-fill" width={20} sx={{ color: 'text.disabled' }} />
          </ListItemButton>
        </Card>

        <Drawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              maxHeight: '80vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              // Same reason as the desktop rail: without an explicit flex column and a
              // shrinkable scroll area the list overflows 80vh and the sheet clips the last
              // sections instead of scrolling to them.
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              flexShrink: 0,
              borderRadius: 2,
              mx: 'auto',
              mt: 1.5,
              bgcolor: 'divider',
            }}
          />

          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
            <Scrollbar sx={{ flex: 1, maxHeight: '100%' }}>
              {renderList({ compact: false })}
            </Scrollbar>
          </Box>
        </Drawer>
      </>
    );
  }

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
      {/* The scroll area needs its own wrapper with `minHeight: 0`.
          A flex item defaults to `min-height: auto`, which refuses to shrink below its content,
          so with fifteen sections the list grew past the Card's maxHeight and the Card — which
          clips by default — simply cut the bottom items off with no scrollbar to reach them.
          On a 1366x768 laptop that hid the whole Administration group in both the expanded and
          the collapsed state. `minHeight: 0` lets it shrink so Scrollbar actually gets a bounded
          box to scroll inside. */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <Scrollbar sx={{ flex: 1, maxHeight: '100%' }}>
          {renderList({ compact: collapsed })}
        </Scrollbar>
      </Box>

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
                  collapsed === isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'
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
  browseLabel: PropTypes.node,
  sx: PropTypes.object,
};
