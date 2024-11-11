import { useState } from 'react';

import Box from '@mui/material/Box';
import { Button, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetSpecialties, useGetPatientFeedbacks } from 'src/api';

import Image from 'src/components/image/image';

import RatingRoomDialog from './ratingDialog';

export default function Specialities() {
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { specialtiesData } = useGetSpecialties();
  const { user } = useAuthContext();

  const handleViewRow = (id) => {
    router.push(paths.dashboard.user.bookappointment(id));
  };

  const [filterforspecialties, setFilterforspecialties] = useState();

  const dataFiltered = applyFilter({
    inputData: specialtiesData,
    filterforspecialties,
  });
  const { feedbackData } = useGetPatientFeedbacks(user?.patient?._id);

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
      <TextField
        onChange={(e) => setFilterforspecialties(e.target.value)}
        sx={{
          mb: 5,
          ml: { md: 14, xs: 11.5 },
          width: { md: '20%', xs: '50%' },
          border: 0.7,
          borderRadius: 1,
        }}
        placeholder="Search..."
      />
      {feedbackData ? <RatingRoomDialog /> : ''}
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
        {dataFiltered.map((data, idx) => (
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
            <Image src={data?.speciality_image} sx={{ width: 70, height: 70, mb: 2 }} />
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
function normalizeArabicText(text) {
  // Normalize Arabic text by replacing 'أ' with 'ا'
  return text.replace(/أ/g, 'ا');
}

function applyFilter({ inputData, filterforspecialties }) {
  if (!filterforspecialties) {
    return inputData;
  }

  // Normalize the search term for comparison
  const normalizedSearchTerm = normalizeArabicText(filterforspecialties.toLowerCase());

  inputData = inputData?.filter((data) => {
    const normalizedDataNameEnglish = normalizeArabicText(data?.name_english.toLowerCase());
    const normalizedDataNameArabic = normalizeArabicText(data?.name_arabic.toLowerCase());
    return (
      normalizedDataNameEnglish.includes(normalizedSearchTerm) ||
      normalizedDataNameArabic.includes(normalizedSearchTerm) ||
      data?._id === filterforspecialties ||
      JSON.stringify(data.code) === filterforspecialties
    );
  });

  return inputData;
}
