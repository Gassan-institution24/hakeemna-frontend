import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import InsuranceHomeView from 'src/sections/unit-service/insurance/view/home';

// ----------------------------------------------------------------------

export default function InsuranceHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Insurances</title>
        <meta name="description" content="meta" />
      </Helmet>

      <InsuranceHomeView />
    </ACLGuard>
  );
}
