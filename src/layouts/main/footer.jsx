import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import Logo from 'src/components/logo';

import footerPic from './footer.svg';

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
      { name: 'FAQ', href: paths.pages.Faq },
    ],
  },
  {
    headline: 'legal',
    children: [
      { name: 'terms and condition', href: paths.pages.Termsandcondition },
      { name: 'Privacy Policy', href: paths.pages.Privacypolicy },
    ],
  },
  {
    headline: 'contact',
    children: [{ name: 'info@hakeemna.com', href: 'mailto:info@hakeemna.com' }],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const homePage = pathname === '/';
  const { t } = useTranslate();

  return homePage ? (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        backgroundImage: `url(${footerPic})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container sx={{ pt: 5, pb: 5, textAlign: { xs: 'center', md: 'unset' } }}>
        <Grid container justifyContent={{ xs: 'center', md: 'space-between' }} alignItems="center">
          <Grid xs={12} md={4}>
            <Logo sx={{ mb: 3, width: 170, height: 150 }} />
            <Typography
              variant="body1"
              sx={{
                mx: { xs: 'auto', md: 'unset' },
                color: '#1F2C5C',
                fontWeight: 700,
              }}
            >
              {t('Electronic innovation for a healthier future')}
            </Typography>
          </Grid>

          {/* Links Section */}
          <Grid xs={12} md={6}>
            <Stack spacing={5} mt={{ xs: 3, md: 0 }} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list, index) => (
                <Stack
                  key={index}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="h6" sx={{ color: '#1F2C5C' }}>
                    {t(list.headline)}
                  </Typography>
                  {list.children.map((link, idx) => (
                    <Link
                      key={idx}
                      component={RouterLink}
                      href={link.href}
                      color="#1F2C5C"
                      variant="subtitle2"
                      textTransform="lowercase"
                      sx={{
                        '&:hover': {
                          color:"white",
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {t(link.name)}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Footer Copyright */}
        <Typography
          variant="body1"
          sx={{ mt: 2, textAlign: { md: 'end', xs: 'center' }, fontWeight: 600, color: 'white' }}
        >
          {t(`© ${new Date().getFullYear()}. All rights reserved`)}
        </Typography>
      </Container>
    </Box>
  ) : null;
}
