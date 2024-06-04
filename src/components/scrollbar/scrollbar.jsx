import PropTypes from 'prop-types';
import { memo, forwardRef } from 'react';

import Box from '@mui/material/Box';

import { StyledScrollbar, StyledRootScrollbar } from './styles';

// ----------------------------------------------------------------------

const Scrollbar = forwardRef(({ children, sx, ...other }, ref) => {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (mobile) {
    return (
      <Box ref={ref} sx={{ overflow: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  const handleMouseWheel = (event) => {
    // Calculate the horizontal scroll amount based on the deltaX property
    const delta = -event.deltaY || event.deltaX * 20;

    // Find the underlying div element and scroll it horizontally
    const scrollElement = event.currentTarget.querySelector('div');
    scrollElement.scrollTo({
      left: scrollElement.scrollLeft - delta,
      behavior: 'smooth',
    });
  };

  return (
    <StyledRootScrollbar>
      <StyledScrollbar
        onScroll={handleMouseWheel}
        scrollableNodeProps={{
          ref,
        }}
        clickOnTrack={false}
        sx={sx}
        {...other}
      >
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
});

Scrollbar.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

export default memo(Scrollbar);
