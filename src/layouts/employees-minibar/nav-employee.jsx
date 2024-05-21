import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { hideScroll } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

// import Logo from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-employee-navigation';
import { useEmPermissionNavData } from './config-permission-us-navigation';
import { usePermissionWGNavData } from './config-permission-wgs-navigation';
import { usePermissionDepNavData } from './config-permission-department-navigation';
// import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useAuthContext();
  const path = window.location.pathname;

  const navData = useNavData();
  const permissionUSData = useEmPermissionNavData();
  const departmentNavData = usePermissionDepNavData();
  const workGroupsNavData = usePermissionWGNavData();
  let currData;
  if (path.indexOf('/dashboard/us/acl/unitservice') !== -1) {
    currData = permissionUSData;
  } else if (path.indexOf('/dashboard/us/acl/departments') !== -1) {
    currData = departmentNavData;
  } else if (path.indexOf('/dashboard/us/acl/workgroups') !== -1) {
    currData = workGroupsNavData;
  } else currData = navData;

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      {/* <NavToggleButton
        sx={{
          top: 22,
          right: NAV.W_MINI - 12,
        }}
      /> */}

      <Stack
        sx={{
          pb: 5,
          height: 1,
          position: 'fixed',
          right: 0,
          top: 170,
          width: NAV.W_MINI,
          borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
          // borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        {/* <Logo sx={{ mx: 'auto', my: 2 }} /> */}

        <NavSectionMini
          data={currData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </Stack>
    </Box>
  );
}
