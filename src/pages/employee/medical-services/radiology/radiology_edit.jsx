import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/medical-services/radiology/radiology_edit';

// ----------------------------------------------------------------------
export default function  RadiologyEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: radiology edit</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
