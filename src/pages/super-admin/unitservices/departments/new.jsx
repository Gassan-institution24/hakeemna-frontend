import { Helmet } from 'react-helmet-async';

import DepartmentsNewView from 'src/sections/super-admin/unitservices/departments/view/new';

// ----------------------------------------------------------------------

export default function DepartmentsNewPage() {
  return (
    <>
      <Helmet>
        <title>New Department </title>
        <meta name="description" content="meta" />
      </Helmet>

      <DepartmentsNewView />
    </>
  );
}
