import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';

export default function SigupButton({ sx }) {
  return (
    <Button
      component={RouterLink}
      // href={SIGNUP_PATH}
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
      Signup
    </Button>
  );
}

SigupButton.propTypes = {
  sx: PropTypes.object,
};
