import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'hakeemna',
    children: [
      { name: 'home', href: '/' },
      { name: 'about us', href: paths.pages.About },
      { name: 'beneficiaries', href: paths.pages.patients },
      { name: 'units of service', href: paths.pages.unit },
      { name: 'Training', href: paths.pages.Training },
    ],
  },
  {
    headline: 'legal',
    children: [
      { name: 'terms and condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'contact',
    children: [{ name: 'info@hakeemna.com', href: '#' }],
  },
];

const _socials = [
  {
    value: 'facebook',
    name: 'FaceBook',
    icon: 'eva:facebook-fill',
    color: '#1877F2',
    path: 'https://www.facebook.com/hakeemna',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    icon: 'ant-design:instagram-filled',
    color: '#E02D69',
    path: 'https://www.instagram.com/hakeemna',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    icon: 'eva:linkedin-fill',
    color: '#007EBB',
    path: 'https://www.linkedin.com/hakeemna',
  },
  {
    value: 'twitter',
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    color: '#00AAEC',
    path: 'https://www.twitter.com/hakeemna',
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const pathname = usePathname();

  const homePage = pathname === '/';

  const { t } = useTranslate();

  // const simpleFooter = (
  //   <Box
  //     component="footer"
  //     sx={{
  //       py: 3,
  //       textAlign: 'center',
  //       position: 'relative',
  //       bgcolor: 'primary.lighter',
  //       // color: 'white',
  //     }}
  //   >
  //     <Stack direction="row" justifyContent="center" alignItems="center">
  //       {mdUp && <Logo sx={{ width: 150, height: 75, position: 'absolute', left: 10 }} />}

  //       <Typography variant="caption" component="div">
  //         © All rights reserved
  //         <br /> made by
  //         <Link href="/"> Doctorna.online </Link>
  //       </Typography>
  //     </Stack>
  //   </Box>
  // );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.neutral',
        // color: 'white',
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 5,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
        >
          <Grid xs={8} md={3}>
            <Logo sx={{ mb: 3, width: 200, height: 100 }} />
            <Typography
              variant="body2"
              sx={{
                maxWidth: 270,
                mx: { xs: 'auto', md: 'unset' },
              }}
            >
              {t('It is time for digital transformation')}
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{
                mt: 3,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social, idx) => (
                <IconButton
                  key={idx}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(social.color, 0.08),
                    },
                  }}
                >
                  <Iconify color={social.color} icon={social.icon} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            <Stack spacing={5} mt={5} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list, index) => (
                <Stack
                  key={index}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="h6">
                    {t(list.headline)}
                  </Typography>

                  {list.children.map((link, idx) => (
                    <Link
                      key={idx}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="subtitle2"
                      textTransform='lowercase'
                    >
                      {t(link.name)}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2, textAlign: { md: 'end', xs: 'center' } }}>
          {t('© 2023. All rights reserved')}
        </Typography>
      </Container>
    </Box>
  );

  return homePage ? mainFooter : mainFooter;
}
