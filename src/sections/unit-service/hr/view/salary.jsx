import React, { useState, useCallback } from 'react';

import { Tab, Tabs, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import MonthlyReportsView from '../salary/monthly-report';
import EmployeeSalaryView from '../salary/employee-salary';
import EditEmployee from '../employee-profile/employee-edit';

// ----------------------------------------------------------------------

export default function HRSalaryView() {
  const { t } = useTranslate();

  const [currentTab, setCurrentTab] = useState('employees');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const TABS = [
    {
      value: 'employees',
      label: t('employees'),
    },
    {
      value: 'monthly report',
      label: t('monthly reports'),
    },
    {
      value: 'yearly report',
      label: t('yearly reports'),
    },
  ].filter(Boolean);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('calculate salary')} 
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          { name: t('human resourse'), href: paths.unitservice.hr.root },
          { name: t('salary') },
        ]}
        sx={{
          mb: { xs: 2, md: 3 },
        }}
      />
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
      {currentTab === 'employees' && <EmployeeSalaryView />}
      {currentTab === 'monthly report' && <MonthlyReportsView />}
      {currentTab === 'yearly report' && <EditEmployee />}
    </Container>
  );
}
