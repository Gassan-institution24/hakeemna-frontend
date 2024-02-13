import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

export default function SigupButton({ sx, scrollToDiv }) {
  return (
    <Button
      component={RouterLink}
      onClick={scrollToDiv}
      variant="outlined"
      sx={{
        mr: 3,
        ...sx,
        bgcolor: 'success.main',
        color: '#fff',
        '&:hover': {
          bgcolor: '#fff',
          color: 'success.main',
        },
      }}
    >
      Sign Up
    </Button>
  );
}

SigupButton.propTypes = {
  sx: PropTypes.object,
  scrollToDiv: PropTypes.func,
};
