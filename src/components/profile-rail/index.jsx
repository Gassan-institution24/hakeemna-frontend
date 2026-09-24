import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';

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

// ----------------------------------------------------------------------

// The rail's scroll area.
//
// This was a <Scrollbar> (SimpleBar), and it silently clipped instead of scrolling: SimpleBar's
// wrapper is `height: 100%` and its root `max-height: 100%`, so the whole chain needs a parent
// with a resolvable height. The Card above only sets `maxHeight`, never `height`, so the
// percentage had nothing definite to resolve against, the inner box grew to its content, and the
// `overflow: hidden` around it cut the last group off with no scrollbar to reach it — on a 768px
// laptop that is the entire Administration group, heading visible and items gone.
//
// A flex item with `minHeight: 0` and `overflowY: auto` is bounded by flex layout itself, so
// there is no percentage to resolve and nothing to get this wrong. The thin thumb keeps the look
// SimpleBar was there for.
const scrollAreaSx = (theme) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  // Deliberately NOT `overscroll-behavior: contain`. The rail is sticky, so reaching the end of
  // this list and having the wheel chain on to the page is what brings the rail's own footer up
  // into view. Containing the scroll here traps the pointer in a list that has nowhere left to go.
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 3,
    backgroundColor: alpha(theme.palette.grey[600], 0.32),
  },
  '&:hover::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.grey[600], 0.48),
  },
  scrollbarWidth: 'thin',
  scrollbarColor: `${alpha(theme.palette.grey[600], 0.32)} transparent`,
});

// Where the rail parks itself once the page has scrolled under the header.
const STICKY_TOP = HEADER.H_DESKTOP + 16;

// Space left below the rail so it does not sit flush against the bottom edge.
const BOTTOM_GUTTER = 24;

// Never squeeze the rail below this, however short the window is — past this point an internal
// scrollbar is more usable than a rail two items tall.
const MIN_RAIL_HEIGHT = 240;

/** The rail's own top in document coordinates — what `position: sticky` does NOT move. */
function staticTopOf(el) {
  let top = 0;
  let node = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
}

/**
 * How tall the rail may be, in pixels.
 *
 * The height used to be the constant `100vh - (sticky top + gutter)`, which is only correct once
 * the rail is actually stuck. Unstuck — at the top of the page, where you land — it starts below
 * the identity banner, ~240px down, so a rail sized for the stuck position hung ~100px past the
 * bottom of the window: the last group and the collapse control were off screen, and being off
 * screen they could not be scrolled to either, because the page scroll is what moves them.
 *
 * So the budget is taken from whichever of the two positions leaves less room, which on every
 * real layout is the unstuck one. That also keeps the rail one fixed size instead of growing and
 * shrinking as you scroll.
 *
 * It deliberately reads `offsetTop` and not `getBoundingClientRect()`. The rect top moves with
 * the sticky shift, and on a short page — where the rail is the tallest thing in the row — a
 * height derived from it feeds back into the page height and the two chase each other: measured
 * at 1366x768 the rail settled 104px taller than the window with its head under the fixed app
 * header. `offsetTop` is a layout value the sticky offset never touches, so there is no loop.
 */
function useAvailableHeight(enabled) {
  const ref = useRef(null);
  const [maxHeight, setMaxHeight] = useState(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Never let a very tall banner push the budget below the floor.
    const unstuckTop = Math.min(staticTopOf(el), window.innerHeight - MIN_RAIL_HEIGHT);
    const top = Math.max(STICKY_TOP, unstuckTop);

    setMaxHeight(Math.max(MIN_RAIL_HEIGHT, Math.round(window.innerHeight - top - BOTTOM_GUTTER)));
  }, []);

  useEffect(() => {
    if (!enabled) {
      setMaxHeight(null);
      return undefined;
    }

    measure();

    window.addEventListener('resize', measure);

    // The banner above the rail changes height when its data arrives and when a long name wraps,
    // both of which move the rail down with no resize event to hear. Watching the document is
    // blunt but safe: `measure` reads only the rail's static top and the window, so re-running it
    // returns the same number and React stops there — the observer cannot drive itself.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (observer) observer.observe(document.body);

    return () => {
      window.removeEventListener('resize', measure);
      if (observer) observer.disconnect();
    };
  }, [enabled, measure]);

  return [ref, maxHeight];
}

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
  const [railRef, railMaxHeight] = useAvailableHeight(mdUp);

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

          <Box sx={scrollAreaSx}>{renderList({ compact: false })}</Box>
        </Drawer>
      </>
    );
  }

  return (
    <Card
      ref={railRef}
      sx={{
        width: collapsed ? collapsedWidth : width,
        flexShrink: 0,
        position: 'sticky',
        top: STICKY_TOP,
        alignSelf: 'flex-start',
        // Measured, not assumed — see useAvailableHeight. The calc() is the first-paint value,
        // before the measurement lands.
        maxHeight: railMaxHeight ? `${railMaxHeight}px` : `calc(100vh - ${STICKY_TOP + 24}px)`,
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.shorter,
        }),
        ...sx,
      }}
      {...other}
    >
      <Box sx={scrollAreaSx}>{renderList({ compact: collapsed })}</Box>

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
