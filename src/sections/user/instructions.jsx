import { PDFDownloadLink } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientInstructionsData } from 'src/api/Instructions';

import Iconify from 'src/components/iconify';

import Back from './imges/back4.png';
import InstructionsPdf from './pdfs/instructionsPdf';
// ----------------------------------------------------------------------

export default function Instructions() {
  const { user } = useAuthContext();
  const { data } = useGetPatientInstructionsData(user?.patient?._id);
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return data?.map((info, index) => (
    <Box key={index}>
      <Card
        key={index}
        sx={{
          backgroundImage: `url(${Back})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(255, 255, 255, 0.800)',
          backgroundBlendMode: 'lighten',
          mb: 3,
        }}
      >
        <Stack sx={{ p: 3, pb: 2 }} direction="row" justifyContent="space-between">
          <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {curLangAr ? info?.patient?.name_arabic : info?.patient?.name_english}
          </Stack>
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption', mt: 1 }}
          >
            <Stack
              spacing={0.5}
              direction="row"
              alignItems="center"
              sx={{ color: 'primary.main', typography: 'caption', mt: 1 }}
            >
              <Iconify width={16} icon="emojione-v1:note-page" />
              {info?.adjustable_documents?.title}
            </Stack>
          </Stack>
          <PDFDownloadLink
            document={<InstructionsPdf Instructions={info} />}
            fileName="Instructions"
            style={{ textDecoration: 'none' }}
          >
            <Tooltip title="Download">
              <IconButton sx={{ color: 'info.main' }}>
                <Iconify icon="akar-icons:cloud-download" />
              </IconButton>
            </Tooltip>
          </PDFDownloadLink>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 3, justifyContent: 'space-between' }}
        >
          {[
            {
              label: info?.adjustable_documents?.applied,
              icon: <Iconify width={16} icon="icon-park-solid:time" sx={{ flexShrink: 0 }} />,
            },
            {
              label: info?.adjustable_documents?.employee?.name_english,
              icon: <Iconify width={17} icon="raphael:employee" sx={{ flexShrink: 0 }} />,
            },
            {
              label: info?.adjustable_documents?.topic,
              icon: <Iconify width={18} icon="ic:round-topic" sx={{ flexShrink: 0 }} />,
            },
          ].map((item, idx) => (
            <Stack
              key={idx}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item?.icon}
              <Typography variant="caption" noWrap>
                {item?.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>
    </Box>
  ));
}
