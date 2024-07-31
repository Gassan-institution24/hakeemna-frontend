import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fTime, fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatientInstructionsData } from 'src/api/Instructions';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function Instructions() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { data } = useGetPatientInstructionsData(user?.patient?._id);
  console.log(data);
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const handleViewRow = (id) => {
    router.push(paths.dashboard.user.bookappointment(id));
  };

  return data?.map((info, index) => (
    <Box>
      <Card key={index}>
        <Stack sx={{ p: 3, pb: 2 }}>
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
