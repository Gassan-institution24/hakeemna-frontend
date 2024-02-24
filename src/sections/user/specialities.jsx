import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetSpecialties } from 'src/api';

import Image from 'src/components/image/image';

export default function Specialities() {
  const router = useRouter();

  const { specialtiesData } = useGetSpecialties();

  const handleViewRow = (id) => {
    router.push(paths.dashboard.user.bookappointment(id));
  };

  return (
    <>
    <Typography variant='h3'  mb={10} sx={{
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
 
    }}>
    What medical specialty are you looking for?
    {/* ما هو التخصص الطبي الذي تبحث عنه */}
    </Typography>
      <Box
        gap={{
          xs: 0,
          sm: 3,
          md: 3,
        }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 2fr)',
          sm: 'repeat(3, 3fr)',
          md: 'repeat(4, 1fr)',
        }}
        sx={{
          ml: {
            xs: 0.5,
            sm: 7,
            md: 2,
            lg: 6,
            xl: 15,
          },
        }}
      >
        {specialtiesData.map((data) => (
          <Button
            sx={{
              display: 'block',
              bgcolor: 'inherit',
              color: 'black',
              width: '200px',
              height: '200px',
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
              sx={{ width: '100px', height: '100px', mb: 2 }}
            />
            {/* // )} */}
            <Typography sx={{ fontWeight: 600 }}>{data?.name_english}</Typography>
          </Button>
        ))}
      </Box>
    </>
  );
}
