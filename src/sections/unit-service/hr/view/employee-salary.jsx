import React from 'react';
import { useParams } from 'react-router';

import { Card, Stack, Avatar, Button, Container, Typography } from '@mui/material';

import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import EmployeeSalaryAttendence from '../salary/employee-salary-attendence';

// ----------------------------------------------------------------------

export default function EmployeeSalaryProfile() {
  const { id } = useParams();
  const { data, refetch } = useGetEmployeeEngagement(id);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  return (
    <Container maxWidth="xl">
      <Card sx={{ px: 4, py: 2, mb: 4 }}>
        <Stack direction={{ md: 'row' }} alignItems="center" gap={5}>
          <Avatar src={data?.employee?.picture} sx={{ width: { md: 50 }, height: { md: 50 } }} />
          <Stack gap={1}>
            <Typography variant="h6">
              {curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}
            </Typography>
          </Stack>
        </Stack>
      </Card>

      <EmployeeSalaryAttendence employee={data} />
    </Container>
  );
}
