import { memo } from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import Scrollbar from 'src/components/scrollbar';
import { NavSectionHorizontal } from 'src/components/nav-section';

import { useNavData } from './config-department-navigation';

// ----------------------------------------------------------------------

function NavDepartment() {
  const theme = useTheme();

  const { user } = useAuthContext();

  const navData = useNavData();

  return (
    <Box
      sx={{
        // m: 'auto',
        top: 0,
        width: `100%`,
        boxShadow: (design) => design.customShadows.z8,
        // position:'absolute'
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

export default memo(NavDepartment);
