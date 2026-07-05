import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import MonthlyReportsView from 'src/sections/unit-service/hr/salary/monthly-report';

// ----------------------------------------------------------------------

export default function MySalaryView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const engagementId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id;

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('my salary')}
          links={[{ name: t('dashboard'), href: paths.employee.root }, { name: t('my salary') }]}
          sx={{ mb: { xs: 2, md: 3 }, mt: { xs: 3, md: 5 } }}
        />
      </Container>

      {/* Reuses the monthly-report list, filtered to the signed-in employee's own reports.
          Each row's "Salary Receipt" action lets the employee sign to approve receipt. */}
      <MonthlyReportsView employee={engagementId} employeeView />
    </>
  );
}
