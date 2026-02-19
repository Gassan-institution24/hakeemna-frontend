import React from 'react';
import { Font } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme, useMediaQuery } from '@mui/material';

import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAllPatientMedicalAnalyses } from 'src/api/medical_analysis_patient';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back.webp';

Font.register({
  family: 'ArabicFont',
  src: '/fonts/IBMPlexSansArabic-Regular.ttf',
});
const truncateText = (text = '', limit = 20) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}…`;
};

export default function MedicalAnalysis() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const { user } = useAuthContext();
  const { analysisData } = useGetAllPatientMedicalAnalyses(user?.patient?._id);
  console.log('analysisData', analysisData);

  const isArabic = currentLang.value === 'ar';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <>
      {analysisData?.length > 0 ? (
        analysisData.map((info, index) => (
          <Card
            key={index}
            sx={{
              backgroundImage: `url(${Back})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(255,255,255,0.8)',
              position: 'relative',

              direction: isArabic ? 'rtl' : 'ltr',
            }}
          >
            {/* ================= Header ================= */}
            <Stack
              sx={{
                p: 2,
                pb: 1,
                height: 110,
                alignItems: 'flex-end',
                textAlign: 'right',
              }}
            >
              <Avatar
                alt={info?.name_english}
                src={user?.patient?.profile_picture}
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  mb: 2,
                  alignSelf: 'flex-end',
                }}
              />

              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{
                  fontWeight: 'bold',
                  width: '100%',
                  direction: isArabic ? 'rtl' : 'ltr',
                }}
              >
                {fDateAndTime(info?.created_at)}
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, max-content)',
                  columnGap: 1.5,
                  rowGap: 1,
                  mt: 2,
                  justifyContent: 'flex-end',
                  justifyItems: 'end',
                  width: '100%',
                }}
              >
                {info?.medical_analyses?.map((analyses, ii) => (
                  <Typography
                    key={ii}
                    sx={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      textAlign: 'right',

                      unicodeBidi: 'plaintext',

                      fontFamily: isArabic ? 'ArabicFont' : 'inherit',
                    }}
                  >
                    {isArabic
                      ? `${
                          isMobile
                            ? truncateText(analyses?.medical_analysis?.name_arabic, 10)
                            : analyses?.medical_analysis?.name_arabic
                        } -`
                      : `- ${
                          isMobile
                            ? truncateText(analyses?.medical_analysis?.name_english, 10)
                            : analyses?.medical_analysis?.name_english
                        }`}
                  </Typography>
                ))}
              </Box>
            </Stack>

            <Divider
              sx={{
                borderStyle: 'dashed',
                borderColor: 'rgba(128,128,128,0.5)',
                mt: 10,
              }}
            />

            {/* ================= Footer ================= */}
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              rowGap={1.5}
              sx={{
                p: 3,
                textAlign: 'right',
              }}
            >
              {[
                {
                  label: isArabic ? user?.patient?.name_arabic : user?.patient?.name_english,
                  icon: <Iconify width={16} icon="fa:user" />,
                },
                {
                  label: isArabic ? info?.employee?.name_arabic : info?.employee?.name_english,
                  icon: <Iconify width={16} icon="mdi:doctor" />,
                },
                {
                  label: isArabic
                    ? info?.unit_service?.name_arabic
                    : info?.unit_service?.name_english,
                  icon: <Iconify width={16} icon="teenyicons:hospital-solid" />,
                },
              ].map((item, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={0.5}
                  sx={{
                    width: '100%',
                    direction: isArabic ? 'rtl' : 'ltr',
                  }}
                >
                  {item.icon}
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      direction: isArabic ? 'rtl' : 'ltr',
                      textAlign: 'right',
                      fontFamily: isArabic ? 'ArabicFont' : 'inherit',
                    }}
                    noWrap
                  >
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Card>
        ))
      ) : (
        <EmptyContent filled title={t('No Data')} sx={{ py: 10 }} />
      )}
    </>
  );
}
