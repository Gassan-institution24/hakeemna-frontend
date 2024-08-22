import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import Footer from './footer';
import Header from './header';

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter()

  const homePage = pathname === '/';
  const loginPage = pathname === '/login';
  const { authenticated } = useAuthContext()

  useEffect(() => {
    if (authenticated && (loginPage || homePage)) {
      router.push(paths.dashboard.root)
    }
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!homePage && {
            pt: { xs: 8, md: 14 },
          }),
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
