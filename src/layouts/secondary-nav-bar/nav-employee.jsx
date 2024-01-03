import { memo } from 'react';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks';

import { bgBlur } from 'src/theme/css';

import Scrollbar from 'src/components/scrollbar';
import { NavSectionHorizontal } from 'src/components/nav-section';

import { useNavData } from './config-employee-navigation';

// ----------------------------------------------------------------------

function NavEmployee() {
  const theme = useTheme();

  const { user } = useAuthContext();

  const navData = useNavData();

  return (
    <Box
      sx={{
        m: 'auto',
        width: `100%`,
        boxShadow: (design) => design.customShadows.z8,
        // ...sx,
      }}
      // {...other}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          // sx={{
          //   '& .simplebar-content': {
          //     display: 'flex',
          //   },
          // }}
        >
          <NavSectionHorizontal
            data={navData}
            slotProps={{
              currentRole: user?.role,
            }}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Scrollbar>
      </Toolbar>

      {/* <HeaderShadow /> */}
    </Box>
  );
}

export default memo(NavEmployee);
