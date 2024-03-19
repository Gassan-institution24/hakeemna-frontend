import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetSpecialties } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image/image';

export default function Specialities() {
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { specialtiesData } = useGetSpecialties();

  const handleViewRow = (id) => {
    router.push(paths.dashboard.user.bookappointment(id));
  };

  return (
    <>
      <Typography
        variant="h3"
        mb={10}
        sx={{
          ml: {
            xs: 0,
            sm: 6,
            md: 14,
          },
          width: {
            xs: 400,
            sm: 700,
            md: 700,
          },
        }}
      >
        {t('What medical specialty are you looking for?')}
      </Typography>
      <Box
        gap={{
          xs: 0,
          sm: 3,
          md: 3,
        }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 3fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        sx={{
          ml: {
            xs: 6.5,
            sm: 7,
            md: 2,
            lg: 6,
            xl: 8,
          },
        }}
      >
        {specialtiesData.map((data, idx) => (
          <Button
            key={idx}
            sx={{
              display: 'block',
              bgcolor: 'inherit',
              color: 'black',
              width: '40vh',
              mb: {
                xs: 2,
                sm: 0,
                md: 0,
              },
            }}
            variant="outlined"
            onClick={() => handleViewRow(data?._id)}
          >
            {/* {data?.specialitiesimge && ( */}
            <Image
              src="https://icon-library.com/images/specialty-icon/specialty-icon-12.jpg"
              sx={{ width: 70, height: 70, mb: 2 }}
            />
            {/* // )} */}
            <Typography sx={{ fontWeight: 600 }}>
              {curLangAr ? data?.name_arabic : data?.name_english}
            </Typography>
          </Button>
        ))}
      </Box>
    </>
  );
}
