import { Helmet } from 'react-helmet-async';

import DepartmentsHomeView from 'src/sections/unit-service/departments/view/home';

// ----------------------------------------------------------------------

export default function DepartmentsHomePage() {
  return (
    <>
      <Helmet>
        <title> Departments </title>
      </Helmet>

       <DepartmentsHomeView />
    </>
  );
}
