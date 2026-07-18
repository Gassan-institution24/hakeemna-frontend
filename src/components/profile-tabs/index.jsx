import PropTypes from 'prop-types';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// ----------------------------------------------------------------------

export default function ProfileTabs({ tabs, value, onChange, sx, ...other }) {
  // Panes such as `edit` are reachable without having a tab of their own; MUI
  // warns unless we tell it no tab is selected.
  const selected = tabs.some((tab) => tab.value === value) ? value : false;

  return (
    // The tabs wrap onto a second row rather than scrolling. MUI's scrollable
    // variant has broken scroll buttons in RTL (Arabic), so wrapping keeps every
    // tab reachable without depending on those arrows. The active underline is
    // drawn per-tab instead of via the shared indicator, which doesn't track a
    // wrapped layout correctly.
    <Tabs
      value={selected}
      onChange={(event, newValue) => onChange(newValue)}
      variant="standard"
      TabIndicatorProps={{ sx: { display: 'none' } }}
      sx={{
        minHeight: 48,
        borderBottom: 1,
        borderColor: 'divider',
        '& .MuiTabs-flexContainer': { flexWrap: 'wrap' },
        ...sx,
      }}
      {...other}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          icon={tab.icon}
          iconPosition={tab.icon ? 'start' : undefined}
          sx={{
            px: 2,
            mb: '-1px',
            minWidth: 'auto',
            minHeight: 48,
            fontWeight: 500,
            textTransform: 'none',
            color: 'text.secondary',
            borderBottom: '2px solid transparent',
            '&:hover': { color: 'primary.dark' },
            '&.Mui-selected': { color: 'primary.main', fontWeight: 600, borderColor: 'primary.main' },
          }}
        />
      ))}
    </Tabs>
  );
}

ProfileTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.node,
      icon: PropTypes.node,
    })
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func,
  sx: PropTypes.object,
};
