import { Helmet } from 'react-helmet-async';

import MaintenanceView from 'src/sections/maintenance';

// ----------------------------------------------------------------------

export default function MaintenancePage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Maintenance</title>
        <meta name="description" content="meta" />
      </Helmet>

      <MaintenanceView />
    </>
  );
}
