import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { hideScroll } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import { NavSectionMini } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-employee-navigation';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useAuthContext();

  const navData = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <Stack
        sx={{
          pb: 5,
          height: 1,
          position: 'fixed',
          right: 0,
          top: 170,
          width: NAV.W_MINI,
          borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </Stack>
    </Box>
  );
}
