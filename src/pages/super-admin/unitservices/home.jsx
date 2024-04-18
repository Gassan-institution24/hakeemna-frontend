import { Helmet } from 'react-helmet-async';

import UnitServicesTableView from 'src/sections/super-admin/unitservices/home/homepage';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> unit of services</title>
        <meta name="description" content="meta" />
      </Helmet>

      <UnitServicesTableView />
    </>
  );
}
