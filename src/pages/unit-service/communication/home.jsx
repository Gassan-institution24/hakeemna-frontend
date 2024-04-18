import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import Communication from 'src/sections/unit-service/communication/view/home';
// ----------------------------------------------------------------------

export default function HomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="communication" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Communication</title>
        <meta name="description" content="meta" />
      </Helmet>

      <Communication />
    </ACLGuard>
  );
}
