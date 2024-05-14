import { useState, useCallback } from 'react';

import { Container } from '@mui/system';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import { Tab, Tabs, Table, TableBody, IconButton } from '@mui/material';

import { fTime, fMonth } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeTodayAppointment } from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

export default function AppointmentsToday() {
  const { user } = useAuthContext();

  const { appointmentsData } = useGetEmployeeTodayAppointment(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]._id
  );
  const theme = useTheme();

  console.log(appointmentsData);
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
      count: appointmentsData?.length,
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
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Patient Note</TableCell>
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            {appointmentsData?.map((info) => (
              <TableBody sx={{ borderBottom: 1 }}>
                <TableRow>
                  <TableCell>{fMonth(info?.start_time)}</TableCell>
                  <TableCell>{fTime(info?.start_time)}</TableCell>
                  <TableCell>{info?.patient?.name_english}</TableCell>
                  <TableCell>{info?.note}</TableCell>
                  <TableCell>
                    <IconButton
                      sx={{
                        p: 2,
                      }}
                      onClick={() => alert('test')}
                    >
                      <Iconify
                        width={25}
                        sx={{ cursor: 'pointer', color: '#2788EF' }}
                        icon="teenyicons:next-solid"
                      />
                      <span style={{ fontSize: 18 }}>Proccess</span>
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
