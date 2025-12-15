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
import { useGetPatintSickLeaves } from 'src/api/sickleave';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back.png';
import PdfPreviewDialogSickLeave from './pdf-preview-dialog-sickleave';

Font.register({
  family: 'ArabicFont',
  src: '/fonts/IBMPlexSansArabic-Regular.ttf',
});


export default function SickLeaves() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { data } = useGetPatintSickLeaves(user?.patient?._id);

  function getPatientLabel() {
    if (curLangAr) {
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
        data?.map((info, index) => (
          <Card
            key={index}
            sx={{
              backgroundImage: `url(${Back})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(255, 255, 255, 0.800)',
              backgroundBlendMode: 'lighten',
            }}
          >
            <Stack sx={{ p: 2, pb: 1, height: 185 }}>
              <Avatar
                alt={info?.name_english}
                src={user?.patient?.profile_picture}
                variant="rounded"
                sx={{ width: 48, height: 48, mb: 2 }}
              />

              <Stack
                spacing={0.5}
                direction="row"
                alignItems="center"
                sx={{ typography: 'caption' }}
              >
                {t('From')} {fDateAndTime(info?.Medical_sick_leave_start)} {t('To')}
                {fDateAndTime(info?.Medical_sick_leave_end)}
              </Stack>
              {/* <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {ConvertToHTML(info?.description)}
          </Stack> */}
            </Stack>
            <Stack sx={{ display: 'inline', m: 2, position: 'absolute', right: 0, top: 0 }}>
              <Tooltip title={t('Download')}>
                <Iconify
                  icon="akar-icons:cloud-download"
                  width={23}
                  sx={{ color: 'info.main', mr: 2, cursor: 'pointer' }}
                  onClick={() => openPdfDialog(info)}
                />
              </Tooltip>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />

            <Box
              rowGap={1.5}
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{ p: 3, justifyContent: 'space-between' }}
            >
              {[
                {
                  label: getPatientLabel(curLangAr, user),
                  icon: <Iconify width={16} icon="fa:user" sx={{ flexShrink: 0 }} />,
                },
                {
                  label: curLangAr
                    ? info?.unit_services?.name_arabic
                    : info?.unit_services?.name_english,
                  icon: (
                    <Iconify width={16} icon="teenyicons:hospital-solid" sx={{ flexShrink: 0 }} />
                  ),
                },
                {
                  label: curLangAr
                    ? `${info?.employee?.name_arabic} (${info?.employee?.speciality?.name_arabic}) `
                    : `${info?.employee?.name_english} (${info?.employee?.speciality?.name_english})`,
                  icon: <Iconify width={16} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
                },
              ].map((item, idx) => (
                <Stack
                  key={idx}
                  spacing={0.5}
                  flexShrink={0}
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'black', minWidth: 0 }}
                >
                  {item?.icon}
                  <Typography variant="caption" noWrap>
                    {item?.label}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Card>
        ))
      ) : (
        <EmptyContent
          filled
          title={t('No Data')}
          sx={{
            py: 10,
          }}
        />
      )}
      <PdfPreviewDialogSickLeave
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        report={selectedReport}
      />
    </>
  );
}
