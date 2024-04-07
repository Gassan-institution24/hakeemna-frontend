import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';
import { useAuthContext } from 'src/auth/hooks';

import Doclogo from './doc.png';
// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const { user } = useAuthContext();
  const USLogo =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
      ?.company_logo;
  const isEmployee = ['employee', 'admin'].includes(user?.role);
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: { xs: 200, md: 200 },
        height: { xs: 110, md: 120 },
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img src={isEmployee ? USLogo : Doclogo} alt="logo" />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
