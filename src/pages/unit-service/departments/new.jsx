import { Helmet } from 'react-helmet-async';

import DepartmentsNewView from 'src/sections/unit-service/departments/view/new';

// ----------------------------------------------------------------------

export default function DepartmentsNewPage() {
  return (
    <>
      <Helmet>
        <title>New Department </title>
      </Helmet>

       <DepartmentsNewView />
    </>
  );
}
