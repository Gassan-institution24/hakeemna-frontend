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

export default function PatientsHero({ currentPage, setCurrentPage }) {
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
            variant="h1"
            sx={{
              textAlign: 'center',
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              fontWeight: 700,
              fontSize: { xs: 35, md: 50 },
              // textShadow: '5px 5px 5px black',
              mb: 3,
            }}
          >
            {t('beneficiary')}
          </Typography>
        </m.div>

        <m.div variants={varFade().in}>
          {!homePage && (
            <Typography
              variant="subtitle1"
              component="p"
              sx={{
                textAlign: 'center',
                textTransform: 'none',
              }}
            >
              {t(
                'The electronic system for personal health records - including this platform - contributes to reducing medical errors and costly repetitive procedures, which leads to increasing the quality of care for patients and enhances effective communication with doctors and medical service providers around the world, especially in the Arab world.'
              )}
              {t(
                'This system works to store and organize medical data and shares that information - according to the desire and need of the user - in every place and time between different health care institutions (private and governmental) in any country in the world, which leads to making more accurate health care decisions, to achieve To this end, the user can store all his medical information in the government health system and his information in the private health system in one place, which is the Hakeemna platform.'
              )}
              {t(
                'Joining the DoctorUna family allows you to benefit from all the services available on this distinguished platform, as DoctorUna. O Line provides various services, including an electronic health records system, communication with doctors and medical service providers, electronic prescriptions, medical reports, and other services.'
              )}
              {t(
                'This platform is characterized by flexibility and comprehensiveness compared to other closed platforms that are used only for individuals who have private medical insurance or government medical coverage, so Hakeemna was designed to include everyone, whether they have medical coverage (private or government) or do not have insurance, in the platform. one.'
              )}
              {t(
                'If the user (patient) has more than one health coverage (for example, private insurance and government insurance) or has part of the medical data stored in a specific database or platform (such as a government platform) and has other medical information that is not stored in that platform In the first and second cases, the user can collect and store all information, data and documents in one place, which is the Hakeemna platform. Thus, this platform becomes the main center for all information that he can use in all his medical affairs.'
              )}
              {t(
                'DoctorUna platform. Online and Family: It provides a service for storing and managing all personal health affairs for all family members electronically in order to help you manage all procedures in one platform.'
              )}
            </Typography>
          )}
          {homePage && (
            <Typography
              variant="subtitle1"
              component="p"
              sx={{
                textAlign: 'center',
                textTransform: 'none',
              }}
            >
              <Typography
                component="h1"
                sx={{
                  display: 'inline',
                  fontSize: 'inherit', // Keeps the size consistent with the rest of the text
                  fontWeight: 'bold', // Optional: makes the "h1" more prominent
                }}
              >
                {t('hakeemna')} &nbsp;
              </Typography>
              {t(
                'provides integrated services to patients in terms of storing data and medical information and managing them in a flexible manner, thus facilitating the mechanism of accessing information, medical history and other data at any time and in communicating with the medical staff in an efficient manner.'
              )}
            </Typography>
          )}
        </m.div>

        <br />
        <Stack direction={{ sx: 'column', md: 'row' }} gap={1}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 0, mx: { md: 2 }, width: 170, py: 1, textTransform: 'uppercase' }}
            onClick={() => router.push(paths.auth.register)}
          >
            {t('join now')}
          </Button>
          {homePage && (
            <Button
              variant="outlined"
              sx={{ borderRadius: 0, width: 170, py: 1 }}
              onClick={() => router.push(paths.pages.patients)}
            >
              {t('read more')}
            </Button>
          )}
        </Stack>
        <br />
      </Stack>
      {!mdUp && homePage && (
        <Stack direction="row" width={1}>
          <Button
            variant="contained"
            // color="primary"
            sx={{ borderRadius: 0, width: '50%', py: 1.5 }}
            onClick={() => setCurrentPage('home')}
          >
            {t('home')}
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{ borderRadius: 0, flex: 1, py: 1.5 }}
            onClick={() => setCurrentPage('doctors')}
          >
            {t('unit of serivce')}
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
        // minHeight: '90vh',
        position: { md: 'absolute' },
        bottom: 0,
        ...(curLangAr ? { left: 0 } : { right: 0 }),
        borderRadius: currentPage === 'users' ? 0 : '50% 0 0 0',
        width: currentPage === 'users' ? '100%' : 0,
        height: currentPage === 'users' ? '100%' : 0,
        transition: 'all 0.5s ease-in-out',
        zIndex: 1,
        backgroundColor: { md: '#d5f7e6' },
        overflow: 'hidden',
      }}
    >
      {renderDescription}
    </Stack>
  );
}
PatientsHero.propTypes = {
  currentPage: PropTypes.string,
  setCurrentPage: PropTypes.func,
};
