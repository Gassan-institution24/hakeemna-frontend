import React from 'react';
import { Font, } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDateAndTime } from 'src/utils/format-time';

import { useGetDrugs } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from "./imges/back3.png"
import PdfPreviewDialogPrescription from './pdf-preview-dialog-Prescription';

Font.register({
  family: 'ArabicFont',
  src: '/fonts/IBMPlexSansArabic-Regular.ttf',
});


export default function Prescriptions() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { drugs } = useGetDrugs(user?.patient?._id);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const openPdfDialog = (report) => {
    setSelectedReport(report);
    setOpenPreview(true);
  };
  return (
    <>
      {drugs?.length > 0 ? (
        drugs?.map((info, index) => (
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
            <Stack sx={{ p: 2, pb: 1, height: 110 }}>
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
                {fDateAndTime(info?.created_at)}
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, max-content)', // 👈 عمودين فقط
                  columnGap: 1.5,
                  rowGap: 1,
                  mt: 2,
                }}
              >
                {info?.medicines?.map((medicine, ii) => (
                  <Typography
                    key={ii}
                    variant="body2"
                    sx={{
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    - {medicine?.medicines?.trade_name}
                  </Typography>
                ))}
              </Box>

            </Stack>
            <Stack sx={{ display: 'inline', m: 2, position: 'absolute', right: 0, top: 0 }}>
              <Tooltip title="Download">
                <Iconify
                  icon="akar-icons:cloud-download"
                  width={23}
                  sx={{ color: 'info.main', mr: 2, cursor: 'pointer' }}
                  onClick={() => openPdfDialog(info)}
                />
              </Tooltip>
            </Stack>
            <Divider
              sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)', mt: 10 }}
            />

            <Box
              rowGap={1.5}
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{ p: 3, justifyContent: 'space-between' }}
            >
              {[
                {
                  label: curLangAr ? user?.patient?.name_arabic : user?.patient?.name_english,
                  icon: <Iconify width={16} icon="fa:user" sx={{ flexShrink: 0 }} />,
                },
                {
                  label: curLangAr ? info?.employee?.name_arabic : info?.employee?.name_english,
                  icon: <Iconify width={16} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
                },
                {
                  label: curLangAr
                    ? info?.unit_service?.name_arabic
                    : info?.unit_service?.name_english,
                  icon: (
                    <Iconify width={16} icon="teenyicons:hospital-solid" sx={{ flexShrink: 0 }} />
                  ),
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
      <PdfPreviewDialogPrescription
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        report={selectedReport}
      />
    </>
  );
}
