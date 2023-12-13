import { Helmet } from 'react-helmet-async';

import UnitServicesTableView from 'src/sections/unitservices/home/homepage';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Unit Services</title>
      </Helmet>

      <UnitServicesTableView />
    </>
  );
}
