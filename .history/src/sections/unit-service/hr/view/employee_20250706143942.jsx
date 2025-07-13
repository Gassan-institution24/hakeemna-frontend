import { useParams } from 'react-router';
import React, { useState, useCallback } from 'react';

import { Tab, Box, Tabs, Card, Stack, Avatar, Button, Container, Typography } from '@mui/material';

import { fTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import EditEmployee from '../employee-profile/employee-edit';
import AttendanceEdit from '../employee-profile/attendance-edit';
import EmployeeAttendence from '../employee-profile/employee-attendence';

// ----------------------------------------------------------------------

export default function EmployeeProfile() {
  const { id } = useParams();
  const { data, refetch } = useGetEmployeeEngagement(id);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('attendance');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const TABS = [
    {
      value: 'attendance',
      label: t('attendance'),
    },
    {
      value: 'edit',
      label: t('edit'),
    },
  ].filter(Boolean);

  const patientGeneralData = [
    { title: 'email', value: data?.employee?.email },
    { title: 'phone', value: data?.employee?.phone },
    { title: 'salary', value: fCurrency(data?.salary) },
    { title: 'start time', value: fTime(data?.start_time) },
    { title: 'end time', value: fTime(data?.end_time) },
    { title: 'work hours / month', value: data?.monthly_hours },
  ];

  return (
    <Container maxWidth="xl">
      <Card sx={{ px: 4, py: 2, mb: 4 }}>
        <Stack direction={{ md: 'row' }} alignItems="center" gap={5}>
          <Avatar src={data?.employee?.picture} sx={{ width: { md: 100 }, height: { md: 100 } }} />
          <Stack gap={1}>
            <Typography variant="h6">
              {curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}
            </Typography>
            <Box
              rowGap={0.5}
              columnGap={8}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {patientGeneralData?.map((one, idx) => (
                <Typography key={idx} variant="body2">
                  <span style={{ fontWeight: 650, color: '#637381' }}>{t(one?.title)}</span>:{' '}
                  <span dir={one.title === 'phone' ? 'ltr' : ''}>
                    {t(one.value)} {one.unit}
                  </span>
                </Typography>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Card>
      <Stack direction="row" justifyContent="space-between">
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab, idx) => (
            <Tab key={idx} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        {currentTab === 'attendance' && (
          <Box>
            <Button onClick={() => setOpen(true)} variant="contained">
              {t('Add new')}
            </Button>
          </Box>
        )}
      </Stack>

      {currentTab === 'attendance' && <EmployeeAttendence employee={data} />}
      {currentTab === 'edit' && <EditEmployee employee={data} refetch={refetch} />}
      <AttendanceEdit
        employeeId={id}
        open={open}
        refetch={() => {
          setCurrentTab('edit');
          setTimeout(() => {
            setCurrentTab('attendance');
          }, 100);
        }}
        onClose={() => setOpen(false)}
      />
    </Container>
  );
}
