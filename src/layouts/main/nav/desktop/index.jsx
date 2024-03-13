import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function NavDesktop({ data, scrollToDiv2 }) {
  return (
    <Stack component="nav" direction="row" spacing={4} sx={{ height: 1, mr: -5 }}>
      {data.map((list, idx) => (
        <NavList key={idx} data={list} />
      ))}
    </Stack>
  );
}

NavDesktop.propTypes = {
  data: PropTypes.array,
  scrollToDiv2: PropTypes.func,
};
