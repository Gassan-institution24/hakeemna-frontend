import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';
// import { PATH_AFTER_LOGIN } from 'src/config-global';
import Units from 'src/sections/home/uspage';


export default function SigupButton({ sx }) {
  return (
    <Button
      component={RouterLink}
      href={Units}
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
