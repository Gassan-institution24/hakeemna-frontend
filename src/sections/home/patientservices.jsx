import * as React from 'react';
import { m } from 'framer-motion';

import { Box } from '@mui/system';
import { Stack, Container, Typography } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

import { patientsServices } from './servicesObjects';

export default function PatientsServices() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <>
      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 8, md: 10 } }}>
        <m.div variants={varFade().inUp}>
          <Typography
            sx={{
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              fontWeight: 700,
              fontSize: { xs: 35, md: 50 },
            }}
          >
            {t('WHAT WE DO')}
          </Typography>
        </m.div>
      </Container>
      <Stack sx={{ alignItems: 'center' }}>
        <Typography
          variant="subtitle1"
          sx={{ mx: { md: 15, xs: 2 }, textAlign: 'center', whiteSpace: 'balance' }}
        >
          {t(
            'The electronic system for personal health records - including this platform - contributes to reducing medical errors and costly repetitive procedures, which leads to increasing the quality of care for patients and enhances effective communication with doctors and medical service providers around the world, especially in the Arab world.'
          )}
          {/* </Typography> */}
          {/* <Typography variant='subtitle1' sx={{ mx: { md: 15, xs: 2 }, textAlign: 'center', whiteSpace: 'balance' }}> */}
          {t(
            'This system works to store and organize medical data and shares that information - according to the desire and need of the user - in every place and time between different health care institutions (private and governmental) in any country in the world, which leads to making more accurate health care decisions, to achieve To this end, the user can store all his medical information in the government health system and his information in the private health system in one place, which is the Hakeemna platform.'
          )}
          {/* </Typography> */}
          {/* <Typography variant='subtitle1' sx={{ mx: { md: 15, xs: 2 }, textAlign: 'center', whiteSpace: 'balance' }}> */}
          {t(
            'Joining the DoctorUna family allows you to benefit from all the services available on this distinguished platform, as DoctorUna. O Line provides various services, including an electronic health records system, communication with doctors and medical service providers, electronic prescriptions, medical reports, and other services.'
          )}
          {/* </Typography> */}
          {/* <Typography variant='subtitle1' sx={{ mx: { md: 15, xs: 2 }, textAlign: 'center', whiteSpace: 'balance' }}> */}
          {t(
            'This platform is characterized by flexibility and comprehensiveness compared to other closed platforms that are used only for individuals who have private medical insurance or government medical coverage, so Hakeemna was designed to include everyone, whether they have medical coverage (private or government) or do not have insurance, in the platform. one.'
          )}
          {/* </Typography> */}
          {/* <Typography variant='subtitle1' sx={{ mx: { md: 15, xs: 2 }, textAlign: 'center', whiteSpace: 'balance' }}> */}
          {t(
            'If the user (patient) has more than one health coverage (for example, private insurance and government insurance) or has part of the medical data stored in a specific database or platform (such as a government platform) and has other medical information that is not stored in that platform In the first and second cases, the user can collect and store all information, data and documents in one place, which is the Hakeemna platform. Thus, this platform becomes the main center for all information that he can use in all his medical affairs.'
          )}
          {/* </Typography> */}
          {/* <Typography variant='subtitle1' sx={{ mx: { md: 15, xs: 2 }, textAlign: 'center', whiteSpace: 'balance' }}> */}
          {t(
            'DoctorUna platform. Online and Family: It provides a service for storing and managing all personal health affairs for all family members electronically in order to help you manage all procedures in one platform.'
          )}
        </Typography>
      </Stack>
      <Box
        m={{ xs: 3, md: 8 }}
        mb={10}
        // gap={{ xs: 3, lg: 0 }}
        columnGap={2}
        rowGap={{ xs: 4, md: 7 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {patientsServices.map((one) => (
          <Stack alignItems="center" justifyContent="flex-start">
            <Stack maxWidth={600}>
              <Typography variant="h6" textAlign="center" mb={2}>
                {curLangAr ? one.ar_title : one.title}
              </Typography>
              {one.items.map((item) => (
                <li>{curLangAr ? item.ar : item.en}</li>
              ))}
            </Stack>
          </Stack>
        ))}
      </Box>
    </>
  );
}
