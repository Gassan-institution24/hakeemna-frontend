import { memo } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import NavList from './nav-list';

// ----------------------------------------------------------------------

function NavSectionHorizontal({ data, slotProps, sx, ...other }) {
  return (
    <Stack
      component="nav"
      id="nav-section-horizontal"
      direction="row"
      justifyContent="space-between"
      // spacing='100px'
      sx={{
        mx: 'auto',
        ...sx,
      }}
      {...other}
    >
      {data.map((group, idx) => (
        <Stack
          component="nav"
          id="nav-section-horizontal"
          direction="row"
          alignItems="center"
          spacing={`${slotProps?.gap || 8}px`}
          sx={{
            mx: '2rem',
            ...sx,
          }}
          {...other}
        >
          <Group key={idx} items={group.items} slotProps={slotProps} />
        </Stack>
      ))}
    </Stack>
  );
}

NavSectionHorizontal.propTypes = {
  data: PropTypes.array,
  sx: PropTypes.object,
  slotProps: PropTypes.object,
};

export default memo(NavSectionHorizontal);

// ----------------------------------------------------------------------

function Group({ items, slotProps }) {
  return (
    <>
      {items.map((list, idx) => (
        <NavList key={idx} data={list} depth={1} slotProps={slotProps} />
      ))}
    </>
  );
}

Group.propTypes = {
  items: PropTypes.array,
  slotProps: PropTypes.object,
};
