import { Helmet } from 'react-helmet-async';

import AddPatient from 'src/sections/super-admin/stakeholders/add/add-stakeholder';

// ----------------------------------------------------------------------

export default function StakeholderAddPage() {
  return (
    <>
      <Helmet>
        <title> Add Patient</title>
        <meta name="description" content="meta" />
      </Helmet>

      <AddPatient />
    </>
  );
}
