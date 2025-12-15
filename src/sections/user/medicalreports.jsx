import * as React from 'react';

import { Box, Card, Stack, Avatar, Tooltip, Divider, Typography } from '@mui/material';

import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatintmedicalreports } from 'src/api/medical_repots';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from "./imges/back2.png"
import PdfPreviewDialog from './pdf-preview-dialog-MedicalReport'

export default function Medicalreports() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { medicalreportsdata } = useGetPatintmedicalreports(user?.patient?._id);

  const formatTextWithLineBreaks = (text, id, limit = 20) => {
    if (!text) return '';

    const chunks = [];
    for (let i = 0; i < text.length; i += 100) {
      chunks.push(text.slice(i, i + 100));
    }

    let formattedText = chunks.join('<br />');

    if (text.length > limit) {
      formattedText = `${text.slice(
        0,
        limit
      )}... <a href="/dashboard/user/medicalreportsview/${id}" style="color:blue;">Read more</a>`;
    }

    return formattedText;
  };
  const [openPreview, setOpenPreview] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const openPdfDialog = (report) => {
    setSelectedReport(report);
    setOpenPreview(true);
  };
  return (
    <>
      {medicalreportsdata?.length > 0 ? (
        medicalreportsdata?.map((info, index) => (
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
            <Stack sx={{ p: 2, pb: 1, height: 150 }}>
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
              <Typography
                dangerouslySetInnerHTML={{
                  __html: formatTextWithLineBreaks(info?.description, info?._id),
                }}
                sx={{ fontSize: 13 }}
              />
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
            <Divider
              sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)', mt: 5 }}
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
                  icon: <Iconify width={18} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
                },
                {
                  label: curLangAr
                    ? info?.unit_service?.name_arabic
                    : info?.unit_service?.name_english,
                  icon: (
                    <Iconify width={16} icon="teenyicons:hospital-solid" sx={{ flexShrink: 0 }} />
                  ),
                },
                info?.file?.length > 0 && {
                  label: curLangAr ? (
                    <span style={{ color: '#22C55E', fontWeight: 600 }}>يحتوي على ملف</span>
                  ) : (
                    <span style={{ color: '#22C55E', fontWeight: 600 }}>File inside</span>
                  ),
                  icon: (
                    <Iconify
                      width={20}
                      icon="material-symbols:image-sharp"
                      sx={{ flexShrink: 0 }}
                    />
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
      ;
      <PdfPreviewDialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        report={selectedReport}
      />
    </>
  );
}
