import * as React from 'react';

import { Box, Card, Stack, Avatar, Tooltip, Divider, Typography } from '@mui/material';

import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatintmedicalreports } from 'src/api/medical_repots';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back.webp';
import PdfPreviewDialog from './pdf-preview-dialog-MedicalReport';

export default function Medicalreports() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { medicalreportsdata } = useGetPatintmedicalreports(user?.patient?._id);

  // ❌ لا تغيير على الفانكشن
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
        medicalreportsdata.map((info, index) => (
          <Card
            key={index}
            sx={{
              backgroundImage: `url(${Back})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(255, 255, 255, 0.800)',
              position: 'relative',
              direction: curLangAr ? 'rtl' : 'ltr',
            }}
          >
            {/* ================= Header ================= */}
            <Stack
              sx={{
                p: 2,
                pb: 1,
                height: 150,
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
                spacing={0.5}
                direction="row"
                justifyContent="flex-end"
                sx={{
                  fontWeight: 'bold',
                  width: '100%',
                  direction: curLangAr ? 'rtl' : 'ltr',
                  unicodeBidi: 'plaintext',
                }}
              >
                {fDateAndTime(info?.created_at)}
              </Stack>

              {/* ================= Description ================= */}
              <Typography
                dangerouslySetInnerHTML={{
                  __html: formatTextWithLineBreaks(info?.description, info?._id),
                }}
                sx={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  mt: 1,
                  textAlign: 'right',

                  direction: curLangAr ? 'rtl' : 'ltr',
                  unicodeBidi: 'plaintext',
                }}
              />
            </Stack>

            {/* ================= Download Icon ================= */}
            <Stack
              sx={{
                position: 'absolute',
                top: 8,
                ...(curLangAr ? { right: 8 } : { left: 8 }),
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

            <Divider
              sx={{
                borderStyle: 'dashed',
                borderColor: 'rgba(128, 128, 128, 0.512)',
                mt: 5,
              }}
            />

            {/* ================= Footer ================= */}
            <Box
              rowGap={1.5}
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{
                p: 3,
                textAlign: 'right',
              }}
            >
              {[
                {
                  label: curLangAr
                    ? user?.patient?.name_arabic
                    : user?.patient?.name_english,
                  icon: <Iconify width={16} icon="fa:user" />,
                },
                {
                  label: curLangAr
                    ? info?.employee?.name_arabic
                    : info?.employee?.name_english,
                  icon: <Iconify width={18} icon="mdi:doctor" />,
                },
                {
                  label: curLangAr
                    ? info?.unit_service?.name_arabic
                    : info?.unit_service?.name_english,
                  icon: <Iconify width={16} icon="teenyicons:hospital-solid" />,
                },
                info?.file?.length > 0 && {
                  label: curLangAr ? (
                    <span style={{ color: '#22C55E', fontWeight: 600 }}>
                      يحتوي على ملف
                    </span>
                  ) : (
                    <span style={{ color: '#22C55E', fontWeight: 600 }}>
                      File inside
                    </span>
                  ),
                  icon: (
                    <Iconify
                      width={20}
                      icon="material-symbols:image-sharp"
                    />
                  ),
                },
              ]
                .filter(Boolean)
                .map((item, idx) => (
                  <Stack
                    key={idx}
                    spacing={0.5}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{
                      color: 'black',
                      minWidth: 0,
                      direction: curLangAr ? 'rtl' : 'ltr',
                    }}
                  >
                    {item.icon}
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        textAlign: 'right',
                        direction: curLangAr ? 'rtl' : 'ltr',
                        unicodeBidi: 'plaintext',
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

      <PdfPreviewDialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        report={selectedReport}
      />
    </>
  );
}
