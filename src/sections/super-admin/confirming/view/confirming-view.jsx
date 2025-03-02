// ----------------------------------------------------------------------

import { Card, Stack, Button, Typography } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetPatients } from 'src/api';

export default function ConfirmingView() {
  const { patientsData, refetch } = useGetPatients({
    confirmed_id: false,
    email: 'exists',
    select: 'name_english identification_num email scanned_identification mobile_num1 wating_to_resend_id',
    populate: { path: 'nationality', select: 'name_english' },
  });
  const handleActivate = async (id) => {
    try {
      await axiosInstance.patch(endpoints.patients.one(id), { confirmed_id: true });
      refetch();
    } catch (e) {
      console.log(e);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(endpoints.patients.one(id));
      refetch();
    } catch (e) {
      console.log(e);
    }
  };
  const handleResendID = async (id) => {
    try {
      await axiosInstance.patch(endpoints.patients.resend(id));
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
          <Card key={idx} sx={{ p: 3, width: '100%' }}>
            <Stack direction={{ md: 'row' }} justifyContent="space-between" gap={4} alignItems="center">
              <img
                decoding="async"
                loading="lazy"
                width={400}
                src={one.scanned_identification}
                alt="scanned_id"
              />
              <Stack gap={1}>
                <Stack direction='row' justifyContent='space-between' paddingLeft={3} paddingRight={3} gap={4}>
                  <Stack gap={1}>
                    <Typography variant="subtitle2"> ID : {one?.identification_num}</Typography>
                    <Typography variant="subtitle2">name : {one?.name_english}</Typography>
                    <Typography variant="subtitle2">email : {one?.email}</Typography>
                  </Stack>
                  <Stack gap={1}>
                    <Typography variant="subtitle2">mobile number : {one?.mobile_num1}</Typography>
                    <Typography variant="subtitle2">
                      {' '}
                      nationality : {one?.nationality?.name_english}
                    </Typography>
                  </Stack>
                </Stack>
                <Button variant="contained" color="primary" sx={{ flex: 3 }} onClick={() => handleActivate(one._id)}>
                  Activate
                </Button>
                <Stack direction='row' gap={1}>
                  <Button variant="contained" disabled={one?.wating_to_resend_id} sx={{ flex: 2 }} onClick={() => handleResendID(one._id)}>
                    {one.wating_to_resend_id ? 'waiting to resend' : 'Resend Id Image'}
                  </Button>
                  <Button variant="contained" color="error" sx={{ flex: 1 }} onClick={() => handleDelete(one._id)}>
                    delete
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
