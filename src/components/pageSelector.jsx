import { Box, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

function PageSelector({ pages }) {
  return (
    <Stack direction="row" justifyContent="center" spacing={1}>
      <Stack
        direction="row"
        justifyContent="center"
        divider={<div style={{ width: '1px', backgroundColor: '#ccc' }} />}
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          m: 2,
          display: 'inline-flex',
          overflow: 'hidden',
          width: 'fit-content', 
        }}
      >
        {pages.map((page) => (
          <Box
            key={page.label}
            sx={{
              display: 'flex', 
              flex: 1,
              minWidth: 0,
              p: 1.5,
              px: 4,
              backgroundColor: page.active ? 'info.darker' : 'transparent',
              color: page.active ? 'common.white' : 'info.darker',
              textAlign: 'center',
              justifyContent: 'center', 
              alignItems: 'center', 
            }}
          >
            {page.label}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default PageSelector;

PageSelector.propTypes = {
  pages: PropTypes.array,
};
