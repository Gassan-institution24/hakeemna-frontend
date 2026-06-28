import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import PatientPage from 'src/sections/unit-service/accounting/claim/patientPage';

// ----------------------------------------------------------------------

export default function PatientVisitView() {
  return (
    <ACLGuard permission="accounting:read">
      <Helmet>
        <title>Claim Company</title>
        <meta name="description" content="claim company" />
      </Helmet>

      <PatientPage />
    </ACLGuard>
  );
}
