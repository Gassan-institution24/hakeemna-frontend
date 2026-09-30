import useSWR, { mutate } from 'swr';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import MonthlyReportsView from 'src/sections/unit-service/hr/salary/monthly-report';
import SalaryReceiptDialog from 'src/sections/unit-service/hr/salary/salary-receipt-dialog';

// Same shape the salary list loads, so the receipt shows name, department and logo.
const REPORT_POPULATE = [
  {
    path: 'employee_engagement',
    select: 'employee department',
    populate: [
      {
        path: 'employee',
        select: 'name_english name_arabic picture',
        populate: { path: 'speciality', select: 'name_english name_arabic' },
      },
      { path: 'department', select: 'name_english name_arabic' },
    ],
  },
  { path: 'unit_service', select: 'company_logo name_english name_arabic phone email address' },
];

// ----------------------------------------------------------------------

export default function MySalaryView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const engagementId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id;

  // Opened from a "salary ready — Sign" notification: /profile/mysalary?sign=<reportId>.
  // That one report is loaded directly (it may be outside the list's current date
  // filter) and its receipt opens ready to sign. The server only ever returns the
  // signed-in employee's own, released reports.
  const signId = searchParams.get('sign');
  const [signOpen, setSignOpen] = useState(false);
  const { data: signData } = useSWR(
    signId && engagementId
      ? [
          endpoints.monthlyReport.all,
          {
            params: {
              id: signId,
              employee_engagement: engagementId,
              availableForViewAndSignature: true,
              populate: REPORT_POPULATE,
            },
          },
        ]
      : null,
    fetcher
  );
  const signReport = signId ? signData?.data?.[0] : null;

  useEffect(() => {
    if (signReport) setSignOpen(true);
  }, [signReport]);

  const closeSign = () => {
    setSignOpen(false);
    router.replace(paths.employee.mysalary.root);
  };

  // After signing, refresh every salary list on the page (it uses its own query).
  const refreshReports = () =>
    mutate((key) => Array.isArray(key) && key[0] === endpoints.monthlyReport.all);

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
          In employee view, only reports HR marked "available for view and signature" are shown.
          Each row's "Salary Receipt" action lets the employee sign to approve receipt. */}
      <MonthlyReportsView employee={engagementId} employeeView />

      {signReport && (
        <SalaryReceiptDialog
          open={signOpen}
          onClose={closeSign}
          row={signReport}
          refetch={refreshReports}
        />
      )}
    </>
  );
}
