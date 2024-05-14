import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';

// import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

// import { fDate } from 'src/utils/format-time';
import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetOneHistoryData } from 'src/api';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';
// ----------------------------------------------------------------------

export default function HistorInfo() {
  const { t } = useTranslate();
  const { id } = useParams();

  const { historyData } = useGetOneHistoryData(id);
  // const handleBackClick = () => {
  // };
  return (
    <Stack
      component={Card}
      spacing={3}
      sx={{ p: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}
    >
      <Box>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Date')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>
            {fDateTime(historyData?.created_at)}
          </span>
        </Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Subject')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>{historyData?.name_english}</span>{' '}
        </Typography>

        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Info')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>{historyData?.sub_english}</span>
        </Typography>

        <Button variant="outlined" sx={{ mt: 2 }}>
          <Iconify icon="icon-park:back" />
          &nbsp; {t('Back')}
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
        {/* {historyData?.file?.map((img) => (
          <Image
            src={`https://api.doctorna.online/uploaded-files/patients/old_medical_reports/${img}`}
            //  src={`http://localhost:3000/uploaded-files/patients/old_medical_reports/${img}`}
            sx={{ m: 1 }}
          />
        ))} */}
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKJKeRhsfM8Xli9VSy3_q48nXRAQih_oLv0q8tta2fw&s"
          sx={{ m: 1 }}
        />
      </Box>
    </Stack>
  );
}
