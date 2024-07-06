import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function UnitServiceHero({ currentPage, setCurrentPage }) {
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const router = useRouter();

  const pathname = usePathname();
  const homePage = pathname === '/';

  const renderDescription = (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          height: 1,
          maxWidth: homePage ? 600 : 1400,
          zIndex: 2,
          pt: { md: 15 },
          px: 3,
        }}
      >
        <m.div variants={varFade().in}>
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              fontWeight: 700,
              fontSize: { xs: 35, md: 50 },
              mb: 3,
            }}
          >
            {t('unit of service')}
          </Typography>
        </m.div>

        <m.div variants={varFade().in}>
          {homePage && <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              //  textShadow: '5px 5px 5px black'
            }}
          >
            {t(
              'It enables medical service providers to deal with patient records electronically and manage their institutions effectively and easily with the aim of raising productivity and improving performance, which leads to enriching the patient experience and paves the way for focusing on the most important matters in your work to raise the degree of excellence and increase competitiveness.'
            )}
          </Typography>}
          {!homePage && <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              //  textShadow: '5px 5px 5px black'
            }}
          >
            {t(
              'These are medical bodies that face great challenges in the ability to provide better services and excellence in a sector that requires and is highly competitive, so this soft drink is required to move towards digital digital transformation in some cases because of what it requires to change and adapt to new technology.\nDigital intelligence requires that it cover all aspects of work in different institutions, and the obstacles that prevent the success of this important transition are varied.Therefore, with the help of God Almighty, the Hakimna platform was designed to take into account those obstacles (financial, tax, training, workability and compatibility with) (systems Different applications and market) to overcome those limitations in the diet of the diet community in one digital platform to provide modern and intelligent care to patients everywhere.'
            )}
          </Typography>}
        </m.div>
        <br />
        <Stack direction={{ sx: 'column', md: 'row' }} gap={1}>
          <Button
            variant="contained"
            color="info"
            sx={{ borderRadius: 0, mx: { md: 2 }, width: 170, py: 1, textTransform: 'uppercase' }}
            onClick={() => router.push(paths.auth.registersu)}
          >
            {t('join now')}
          </Button>
          {homePage && (
            <Button
              variant="outlined"
              sx={{ borderRadius: 0, width: 170, py: 1 }}
              onClick={() => router.push(paths.pages.unit)}
            >
              {t('read more')}
            </Button>
          )}
        </Stack>
        <br />
      </Stack>
      {!mdUp && setCurrentPage && (
        <Stack direction="row" width={1}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 0, width: '50%', py: 1.5 }}
            onClick={() => setCurrentPage('users')}
          >
            {t('beneficiary')}
          </Button>
          <Button
            variant="contained"
            // color="info"
            sx={{ borderRadius: 0, flex: 1, py: 1.5 }}
            onClick={() => setCurrentPage('home')}
          >
            {t('home')}
          </Button>
        </Stack>
      )}
    </>
  );

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      width={1}
      height={1}
      sx={{
        position: 'absolute',
        bottom: 0,
        ...(curLangAr ? { right: 0 } : { left: 0 }),
        borderRadius: currentPage === 'doctors' ? 0 : '0 50% 0 0',
        width: currentPage === 'doctors' ? '100%' : 0,
        height: currentPage === 'doctors' ? '100%' : 0,
        transition: 'all 0.5s ease-in-out',
        zIndex: 1,
        backgroundColor: { md: '#aee2ff' },
        overflow: 'hidden',
      }}
    >
      {renderDescription}
    </Stack>
  );
}
UnitServiceHero.propTypes = {
  currentPage: PropTypes.string,
  setCurrentPage: PropTypes.func,
};
