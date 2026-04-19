import { useNavigate } from 'react-router';

import { Box, Stack } from '@mui/system';
import { Card, Button, Typography } from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { useGetOneRadiologyPatient } from 'src/api/radiology_patient';

import Iconify from 'src/components/iconify/iconify';

export default function MedicalAnalysisPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { radiologyData } = useGetOneRadiologyPatient(id);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        component={Card}
        sx={{
          p: 4,
          width: '85%',
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            pb: 2,
            borderBottom: '1px solid #eee',
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            {t('medical analysis details')}
          </Typography>

          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            {t('creation time')} : {fDateTime(radiologyData?.created_at)}
          </Typography>
        </Box>

        {/* Doctor */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {t('doctor')} :
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              {curLangAr
                ? radiologyData?.employee?.name_arabic
                : radiologyData?.employee?.name_english}
            </Typography>
          </Box>
        </Box>
        {/* Patient */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {t('patient')} :
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              {curLangAr
                ? radiologyData?.unit_service_patient?.name_arabic ||
                  radiologyData?.unit_service_patient?.name_english
                : radiologyData?.unit_service_patient?.name_english ||
                  radiologyData?.unit_service_patient?.name_arabic}
            </Typography>
          </Box>
        </Box>

        {/* Medicines */}
        {radiologyData?.radiology?.map((item, index) => (
          <Box
            key={index}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              border: '1px solid #eee',
              bgcolor: '#fafafa',
            }}
          >
            {/* Medicine Name */}
            <Typography variant="h6" fontWeight={700} mb={2}>
              {item?.radiology?.diagnostic_test}
            </Typography>
            {/* Doctor Notes */}
            {item?.Doctor_Comments && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#fff',
                  borderLeft: '4px solid #4CAF50',
                  borderRadius: 1,
                }}
              >
                <Typography fontWeight={600} mb={0.5}>
                  {t('doctor comment')}
                </Typography>
                <Typography color="text.secondary">{item?.Doctor_Comments}</Typography>
              </Box>
            )}
          </Box>
        ))}

        {/* Back */}
        <Button variant="text" sx={{ mt: 2, alignSelf: 'flex-start' }} onClick={() => navigate(-1)}>
          <Iconify icon="icon-park:back" />
          &nbsp; رجوع
        </Button>
      </Stack>
    </Box>
  );
}
