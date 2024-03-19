import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import OldPatientView from 'src/sections/unit-service/old_patient/view/home';

// ----------------------------------------------------------------------

export default function OldPatientPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="old_patient" acl="create">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : Old patient</title>
        <meta name="description" content="meta" />
      </Helmet>

      <OldPatientView />
    </ACLGuard>
  );
}
