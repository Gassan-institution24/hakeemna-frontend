import { useState, useCallback } from 'react';

import { Container } from '@mui/system';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Tab, Tabs, Table, TableBody, Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

export default function AppointmentsToday() {
  const TABS = [
    {
      value: 'one',
      label: (
        <>
          Appointments Today &nbsp;
          <Typography sx={{ bgcolor: 'lightGreen', p:0.5 }}>0</Typography>
        </>
      ),
    },
    {
      value: 'two',
      label: (
        <>
          Upcoming &nbsp;
          <Typography sx={{ bgcolor: 'lightGreen', p:0.5 }}>0</Typography>
        </>
      ),
    },
    {
      value: 'three',
      label: (
        <>
          Waiting &nbsp;
          <Typography sx={{ bgcolor: 'lightGreen', p:0.5 }}>0</Typography>
        </>
      ),
    },
    {
      value: 'four',
      label: (
        <>
          Finished &nbsp;
          <Typography sx={{ bgcolor: 'lightGreen', p:0.5 }}>0</Typography>
        </>
      ),
    },
  ];

  const [currentTab, setCurrentTab] = useState('one');
  const { user } = useAuthContext();

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
      <Tabs value={currentTab} onChange={handleChangeTab}>
        {TABS.map((tab) => (
          <Tab
            iconPosition="end"
            key={tab.value}
            icon={tab.icon}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      {/* <Card
        sx={{
          mt: 5,
          p: 3,
          //   gap: 5,
        }}
      > */}
      <TableContainer sx={{ mt: 3, mb: 2 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                {/* <TableCell>{t('Date')}</TableCell>
              

                  {/* <TableCell align="center">{t('Actions')}</TableCell> */}
                <TableCell>Info</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Info</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Info</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Info</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      {/* </Card> */}
    </Container>
  );
}
