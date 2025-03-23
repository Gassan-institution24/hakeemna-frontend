import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

function PageSelector({ pages, vertical = false }) {
  const mdUp = useResponsive('up', 'md');
  if (!mdUp) vertical = false;
  return (
    <Stack
      sx={{
        ...(vertical && {
          position: 'sticky',
          top: 0,
          zIndex: 10,
          alignSelf: 'flex-start',
          width: 'max-content',
        }),
      }}
      direction={vertical ? "column" : "row"}
      justifyContent={vertical ? "flex-start" : "center"}
      spacing={1}>
      <Stack
        direction={vertical ? "column" : "row"}
        justifyContent="center"
        divider={<div style={{ width: '1px', backgroundColor: '#ccc' }} />}
        sx={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: 2,
          m: 2,
          display: 'inline-flex',
          overflow: 'hidden',
          width: 'fit-content',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {pages.map((page) => (
          <Box
            key={page.label}
            onClick={page.onClick}
            sx={{
              cursor: page.onClick ? 'pointer' : 'default',
              display: 'flex',
              flex: 1,
              p: 1.5,
              px: 4,
              backgroundColor: page.active ? 'info.darker' : 'transparent',
              color: page.active ? 'common.white' : 'info.darker',
              textAlign: 'center',
              minWidth: 'max-content',
              justifyContent: 'center',
              alignItems: 'center',
              whiteSpace: { md: 'nowrap' },
              borderRight: vertical ? 'none' : '1px solid #ccc',
              borderBottom: vertical ? '1px solid #ccc' : 'none',
              '&:last-child': {
                borderRight: 'none',
                borderBottom: 'none',
              },
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
  vertical: PropTypes.bool,
};
