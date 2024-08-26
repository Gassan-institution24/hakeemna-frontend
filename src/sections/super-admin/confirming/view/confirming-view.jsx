// ----------------------------------------------------------------------

import { Card, Stack, Button, Typography } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetPatients } from 'src/api';

export default function ConfirmingView() {
  const { patientsData, refetch } = useGetPatients({
    confirmed_id: false,
    select: 'name_english identification_num email scanned_identification',
    populate: { path: 'nationality', select: 'name_english' },
  });
  console.log('patientsData', patientsData);
  const handleActivate = async (id) => {
    try {
      await axiosInstance.patch(endpoints.patients.one(id), { confirmed_id: true });
      refetch();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Stack>
      <Typography variant="subtitle1">{patientsData?.length} result found</Typography>
      <Stack sx={{ justifyContent: 'center', alignItems: 'center', gap: 5, mt: 5 }}>
        {patientsData?.map((one, idx) => (
          <Card sx={{ p: 3, minWidth: '60vw' }}>
            <Stack direction={{ md: 'row' }} justifyContent="space-between" alignItems="center">
              <img width={600} src={one.scanned_identification} alt="scanned_id" />
              <Stack minWidth="40%" gap={1}>
                <Typography variant="subtitle2"> ID : {one?.identification_num}</Typography>
                <Typography variant="subtitle2">name : {one?.name_english}</Typography>
                <Typography variant="subtitle2">email : {one?.email}</Typography>
                <Typography variant="subtitle2">
                  {' '}
                  nationality : {one?.nationality?.name_english}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleActivate(one._id)}>
                  Activate
                </Button>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
