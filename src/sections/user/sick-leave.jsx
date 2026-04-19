import * as React from 'react';
import { Font } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatintSickLeaves } from 'src/api/sick_leave';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back.webp';
import PdfPreviewDialogSickLeave from './pdf-preview-dialog-sick-leave';

Font.register({
  family: 'ArabicFont',
  src: '/fonts/IBMPlexSansArabic-Regular.ttf',
});

export default function SickLeaves() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const isArabic = currentLang.value === 'ar';

  const { user } = useAuthContext();
  const { data } = useGetPatintSickLeaves(user?.patient?._id);

  function getPatientLabel() {
    if (isArabic) {
      if (user?.patient?.gender === 'female') {
        return `السيدة ${user?.patient?.name_arabic}`;
      }
      return `السيد ${user?.patient?.name_arabic}`;
    }
    if (user?.patient?.gender === 'male') {
      return `mr. ${user?.patient?.name_english}`;
    }
    return `ms. ${user?.patient?.name_english}`;
  }

  const [openPreview, setOpenPreview] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const openPdfDialog = (report) => {
    setSelectedReport(report);
    setOpenPreview(true);
  };

  return (
    <>
      {data?.length > 0 ? (
        data.map((info, index) => (
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
                height: 185,
                alignItems: 'flex-end',
                textAlign: 'right',
                fontWeight: "bold"
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
                  typography: 'caption',
                  width: '100%',
                  direction: isArabic ? 'rtl' : 'ltr',
                  unicodeBidi: 'plaintext',
                  fontWeight: "bold" ,
                  fontSize: 14
                }}
              >
                {isArabic ? (
                  <>
                    {fDateAndTime(info?.Medical_sick_leave_start)} {t('To')}{' '}
                    {fDateAndTime(info?.Medical_sick_leave_end)} {t('From')}
                  </>
                ) : (
                  <>
                    {t('From')} {fDateAndTime(info?.Medical_sick_leave_start)} {t('To')}{' '}
                    {fDateAndTime(info?.Medical_sick_leave_end)}
                  </>
                )}
              </Stack>
            </Stack>

            {/* ================= Download Icon ================= */}
            <Stack
              sx={{
                position: 'absolute',
                top: 8,
                ...(isArabic ? { right: 8 } : { left: 8 }),
              }}
            >
              <Tooltip title={t('Download')}>
                <Iconify
                  icon="akar-icons:cloud-download"
                  width={23}
                  sx={{ color: 'info.main', cursor: 'pointer' }}
                  onClick={() => openPdfDialog(info)}
                />
              </Tooltip>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128,128,128,0.5)' }} />

            {/* ================= Footer ================= */}
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              rowGap={1.5}
              sx={{
                p: 3,
                textAlign: 'right',
                fontWeight: "bold",
              }}
            >
              {[
                {
                  label: getPatientLabel(),
                  icon: <Iconify width={16} icon="fa:user" />,
                },
                {
                  label: isArabic
                    ? info?.unit_services?.name_arabic
                    : info?.unit_services?.name_english,
                  icon: <Iconify width={16} icon="teenyicons:hospital-solid" />,
                },
                {
                  label: isArabic
                    ? `${info?.employee?.name_arabic} (${info?.employee?.speciality?.name_arabic})`
                    : `${info?.employee?.name_english} (${info?.employee?.speciality?.name_english})`,
                  icon: <Iconify width={16} icon="mdi:doctor" />,
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
                    fontWeight: "bold",
                  }}
                >
                  {item.icon}
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      textAlign: 'right',
                      direction: isArabic ? 'rtl' : 'ltr',
                      unicodeBidi: 'plaintext',
                      fontWeight: "bold",
                    }}
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

      <PdfPreviewDialogSickLeave
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        report={selectedReport}
      />
    </>
  );
}
