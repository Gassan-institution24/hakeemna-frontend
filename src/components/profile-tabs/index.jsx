import PropTypes from 'prop-types';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// ----------------------------------------------------------------------

export default function ProfileTabs({ tabs, value, onChange, sx, ...other }) {
  // Panes such as `edit` are reachable without having a tab of their own; MUI
  // warns unless we tell it no tab is selected.
  const selected = tabs.some((tab) => tab.value === value) ? value : false;

  return (
    <Tabs
      value={selected}
      onChange={(event, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        minHeight: 48,
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: 'primary.main',
        },
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
            minWidth: 'auto',
            minHeight: 48,
            fontWeight: 500,
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.dark' },
            '&.Mui-selected': { color: 'primary.main', fontWeight: 600 },
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
