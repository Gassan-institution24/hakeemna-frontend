import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/medical-services/radiology/radiology_create';

// ----------------------------------------------------------------------
export default function RadiologyCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: radiology create</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}