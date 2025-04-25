import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import HRSalaryView from 'src/sections/unit-service/hr/view/salary';

// ----------------------------------------------------------------------

export default function HRSalaryPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <>
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Human resourse</title>
        <meta name="description" content="meta" />
      </Helmet>

      <HRSalaryView />
    </>
  );
}
