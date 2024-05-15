import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { Container } from '@mui/system';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import { Tab, Tabs, Table, Button, TableBody, IconButton } from '@mui/material';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUsAppointmentsToday } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

export default function AppointmentsToday() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const { appointmentsData, refetch } = useGetUsAppointmentsToday(
    user?.employee?.employee_engagements?.[0]?.unit_service?._id
  );
  
  // console.log(appointmentsData,"fdldkldfkldf");
  const theme = useTheme();

  const arivedyes = async (Data) => { 
    try {
      await axiosInstance.patch(`${endpoints.appointments.one(Data)}`, {
        arrived: true,
      });

      refetch();
      enqueueSnackbar('Patient Arrived', { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      // enqueueSnackbar(
      //   curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
      //   {
      //     variant: 'error',
      //   }
      // );
      enqueueSnackbar('Call to make sure', { variant: 'success' });
    }
  };
  const arivedno = async (Data) => {
    try {
      await axiosInstance.patch(`${endpoints.appointments.one(Data)}`, {
        arrived: false,
      });

      refetch();
      enqueueSnackbar('Patient Arrived', { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      // enqueueSnackbar(
      //   curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
      //   {
      //     variant: 'error',
      //   }
      // );
      enqueueSnackbar('Call to make sure', { variant: 'error' });
    }
  };

  const TABS = [
    {
      value: 'one',
      label: 'Appointments Today',
      color: 'info',
      count: appointmentsData?.length,
    },
    {
      value: 'two',
      label: 'Coming',
      color: 'success',
      count: appointmentsData?.length,
    },
    {
      value: 'three',
      label: 'Waiting',
      color: 'warning',
      count: appointmentsData?.length
    },
    {
      value: 'four',
      label: 'Finished',
      color: 'error',
      count: appointmentsData?.length,
    },
  ];

  const [currentTab, setCurrentTab] = useState('one');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container>
      <CustomBreadcrumbs
        heading="Appointments Today"
        links={[
          {
            name: user.userName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          px: 2.5,
          boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        {TABS.map((tab, idx) => (
          <Tab
            key={idx}
            value={tab.value}
            label={tab.label}
            iconPosition="end"
            icon={<Label color={tab.color}>{tab.count}</Label>}
          />
        ))}
      </Tabs>
      <TableContainer sx={{ mt: 3, mb: 2 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Patient Note</TableCell>
                <TableCell>Coming</TableCell>
                <TableCell>Arrived</TableCell>
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            {appointmentsData?.map((info, index) => (
              <TableBody key={index} sx={{ borderBottom: 1 }}>
                <TableRow key={index}>
                  <TableCell>{fTime(info?.start_time)}</TableCell>
                  <TableCell>{info?.patient?.name_english}</TableCell>
                  <TableCell>{info?.note}</TableCell>
                  <TableCell>{info.coming ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {info?.arrived === true ? (
                      'YES'
                    ) : (
                      <>
                        <Button
                          sx={{
                            p: 2,
                          }}
                          onClick={() => arivedyes(info?._id)}
                        >
                          Yes
                        </Button>
                        <Button
                          sx={{
                            p: 2,
                          }}
                          onClick={() => arivedno(info?._id)}
                        >
                          No
                        </Button>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {info.coming === true ? (
                      <IconButton
                        sx={{
                          p: 2,
                        }}
                        onClick={() => alert('test')}
                      >
                        <Iconify
                          width={20}
                          sx={{ cursor: 'pointer', mr: 1, color: '#2788EF' }}
                          icon="teenyicons:next-solid"
                        />
                        <span style={{ fontSize: 16 }}>Start</span>
                      </IconButton>
                    ) : (
                      <IconButton
                        sx={{
                          p: 2,
                        }}
                        disabled
                      >
                        <Iconify
                          width={20}
                          sx={{ cursor: 'pointer', mr: 1, color: '#2788EF' }}
                          icon="teenyicons:next-solid"
                        />
                        <span style={{ fontSize: 16 }}>Start</span>
                      </IconButton>
                    )}

                    <IconButton
                      sx={{
                        p: 2,
                      }}
                      onClick={() => alert('test')}
                    >
                      <Iconify
                        width={20}
                        sx={{ cursor: 'pointer', mr: 1, color: 'success.main' }}
                        icon="material-symbols:call"
                      />
                      <span style={{ fontSize: 16 }}>Call</span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </Scrollbar>
      </TableContainer>
    </Container>
  );
}
