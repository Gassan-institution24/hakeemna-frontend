import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import ServicesHomeView from 'src/sections/unit-service/tables/services/view/home';

// ----------------------------------------------------------------------

export default function ServicesHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title>{serviceUnitName} : services </title>
        <meta name="description" content="meta" />
      </Helmet>

      <ServicesHomeView />
    </ACLGuard>
  );
}
