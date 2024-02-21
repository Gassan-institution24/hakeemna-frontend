import Box from '@mui/material/Box';
import { useCallback } from 'react';

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
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
    >
      {specialtiesData.map((data) => (
        <Button sx={{ display: 'block' }} variant="outlined" onClick={()=>handleViewRow(data?._id)}>
          {data?.specialitiesimge && (
            <Image src={data?.specialitiesimge} sx={{ width: '100px', height: '100px', mb: 2 }} />
          )}
          <Typography>{data?.name_english}</Typography>
        </Button>
      ))}
    </Box>
  );
}
