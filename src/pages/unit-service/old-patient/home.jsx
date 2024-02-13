import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import OldPatientView from 'src/sections/unit-service/old_patient/view/home';

// ----------------------------------------------------------------------

export default function OldPatientPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="old_patient" acl="create">
      <Helmet>
        <title>Old patient</title>
      </Helmet>

      <OldPatientView />
    </ACLGuard>
  );
}
