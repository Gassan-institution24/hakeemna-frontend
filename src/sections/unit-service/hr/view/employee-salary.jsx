import { useParams } from 'react-router';
import React, { useState, useCallback } from 'react';

import { Tab, Tabs, Stack, Container, Typography, IconButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import YearlyReportsView from '../salary/yearly-report';
import MonthlyReportsView from '../salary/monthly-report';
import EmployeeSalaryAttendence from '../salary/employee-salary-attendence';

// ----------------------------------------------------------------------

export default function EmployeeSalaryProfile() {
  const { t } = useTranslate();
  const { id } = useParams();
  const { data } = useGetEmployeeEngagement(id);
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState('attendence');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const TABS = ['attendence', 'monthly reports', 'yearly reports'];

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => router.back()}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <Typography variant="h6">
          {curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}
        </Typography>
      </Stack>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab, idx) => (
          <Tab key={idx} label={t(tab)} value={tab} />
        ))}
      </Tabs>

      {currentTab === 'attendence' && <EmployeeSalaryAttendence employee={data} />}
      {currentTab === 'monthly reports' && <MonthlyReportsView employee={data?._id} />}
      {currentTab === 'yearly reports' && <YearlyReportsView employee={data?._id} />}
    </Container>
  );
}
