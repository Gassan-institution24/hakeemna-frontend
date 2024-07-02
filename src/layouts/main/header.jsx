import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// dark mode
import AppBar from '@mui/material/AppBar';
// import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useTranslate } from 'src/locales';

import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import HeaderShadow from '../common/header-shadow';
import Language from '../common/language-home-page';
// ----------------------------------------------------------------------

export default function Header() {
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate()

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          backgroundColor: 'white',
          // borderBottom: '1px solid #adb5bd'
        }}
      >
        {/* <Container
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        > */}

        <Logo sx={{ width: 250 }} />
        {/* </Container> */}
        {mdUp && <Stack width={1}>
          <Stack direction="row" width={1} flex={0.2} alignItems="center" justifyContent="center">
            <Container
              sx={{
                width: 1,
                fontSize: 13,
                fontWeight: 500,
                mb: 0.5,
                letterSpacing: -0.5,
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                textTransform: 'uppercase',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row">
                <Iconify icon="ion:call" width={15} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 13, fontWeight: 500, mr: 2, ml: 1 }}
                >
                  +962 799411555
                </Typography>
                <Iconify icon="clarity:email-solid" width={18} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 13, fontWeight: 500, textTransform: 'lowercase', ml: 1 }}
                >
                  info@hakeemna.com
                </Typography>
              </Stack>
              <Stack direction="row">
                <Link
                  href={paths.auth.registersu}
                  sx={{ borderRight: '1px solid black', py: 0.2, px: 1.5 }}
                >
                  {t('join as unit of service')}
                </Link>
                <Link
                  href={paths.auth.stakeholderRegister}
                  sx={{ borderRight: '1px solid black', py: 0.2, px: 1.5 }}
                >
                  {t('join as supplier')}
                </Link>
                <Link
                  href={paths.auth.register}
                  sx={{ borderRight: '1px solid black', py: 0.2, px: 1.5 }}
                >
                  {t('join as user')}
                </Link>
                <Link href={paths.auth.login} sx={{ py: 0.2, px: 1.5 }}>
                  {t('login')}
                </Link>
              </Stack>
            </Container>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            width={1}
            height={80}
            justifyContent="space-between"
            alignItems="center"
          >
            <Container
              sx={{
                width: 1,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* <Badge
                sx={{
                  [`& .${badgeClasses.badge}`]: {
                    top: 0,
                    right: -16,
                  },
                  display: { md: 'flex', xs: 'none' },
                }}
              >
                <Logo />
              </Badge> */}
              {mdUp && <NavDesktop data={navConfig} />}
              <Box sx={{ flexGrow: 1 }} />
              <Language />


            </Container>
          </Stack>
        </Stack>}
        {!mdUp && <Stack alignItems="center" justifyContent='flex-end' direction='row' width={1}>
          <Language />
          <NavMobile data={navConfig} />
        </Stack>}
      </Toolbar>
      <Divider />

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
