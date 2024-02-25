import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { Button, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useParams } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';
import { fTime } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';
import axiosHandler from 'src/utils/axios-handler';

import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeEngagement, useGetEmployeeSelectedAppointments } from 'src/api';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
// ----------------------------------------------------------------------

export default function Doctorpage() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuthContext();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [TimeData, setTimeData] = useState();
  const patientData = user?.patient?._id;
  const { appointmentsData, refetch } = useGetEmployeeSelectedAppointments({
    id,
    startDate: currentDateTime,
  });
  const handleBook = useCallback(
    async (pateinidd) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointment(pateinidd)}/book`,
        data: { patient: patientData },
      });
      refetch();
    },
    [patientData, refetch]
  );
  const { data } = useGetEmployeeEngagement(id);

  console.log(TimeData);

  const renderHead = (
    <CardHeader
      disableTypography
      avatar={<Avatar src={data?.employee?.picture} alt="data" />}
      title={
        <Link color="inherit" variant="subtitle1">
          {data?.employee?.first_name} {data?.employee?.middle_name} {data?.employee?.family_name}
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
          {data?.employee?.speciality?.name_english}
        </Box>
      }
    />
  );

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>{fNumber('sdsdds')}</Stack>

        <Stack width={1}>{fNumber('info.totalFollowing')}</Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>{data?.employee?.description}</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Work at: `}
            <Link variant="subtitle2" color="inherit">
              {data?.unit_service?.name_english}
            </Link>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Iconify icon="mdi:location" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Location: `}
            <Link variant="subtitle2" color="inherit">
              {data?.unit_service?.city?.name_english} {` - `}{' '}
              {data?.unit_service?.country?.name_english}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="typcn:phone" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`For booking: `}
            <Link variant="subtitle2" color="inherit">
              {data?.unit_service?.phone}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          {data?.employee?.online === false ? (
            <Iconify icon="fxemoji:noentrysign" width={24} />
          ) : (
            <Iconify icon="icon-park:correct" width={24} />
          )}

          <Box sx={{ typography: 'body2' }}>Available online</Box>
        </Stack>
      </Stack>
    </Card>
  );
  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          orientation="landscape"
          disablePast
          componentsProps={{ actionBar: { actions: ['clear', 'today'] } }}
          // value={currentDateTime}
          onChange={(e) => setCurrentDateTime(e.$d)}
        />
      </LocalizationProvider>
      {appointmentsData.length > 0 ? (
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            SELECT TIME
          </Typography>

          {appointmentsData.map((time, index) => (
            <Box key={index} sx={{ display: 'flex' }}>
              <Box sx={{ width: '35%' }}>
                <Button onClick={() => setTimeData(time?._id)}> {fTime(time?.start_time)} </Button>
              </Box>

              {/* <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} /> */}
              {/* <Box> */}
                {/* <Button> {fTime(time?.start_time)} </Button> */}
                {/* data */}
              {/* </Box> */}
            </Box>
          ))}
          <Button variant="contained" onClick={() => handleBook(TimeData)}>
            {' '}
            Book
          </Button>
        </Box>
      ) : (
        <EmptyContent filled title="No Available Appointments" sx={{ py: 10 }} />
      )}
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {/* <Iconify icon="pepicons-print:internet" /> */}
        <Link href={data?.web_page} target="_blank" rel="noopener noreferrer">
          {data?.web_page}
        </Link>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderHead}
          {renderFollows}

          {renderAbout}
          {data?.web_page?.length > 1 ? renderSocials : ''}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>{renderPostInput}</Stack>
      </Grid>
    </Grid>
  );
}
