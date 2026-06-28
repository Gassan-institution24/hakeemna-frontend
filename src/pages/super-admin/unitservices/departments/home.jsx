import { Helmet } from 'react-helmet-async';

// import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentsHomeView from 'src/sections/super-admin/unitservices/departments/view/home';

// ----------------------------------------------------------------------

export default function DepartmentsHomePage() {
  return (
    // <ACLGuard permission="departments:read">
    <>
      <Helmet>
        <title> Departments </title>
        <meta name="description" content="meta" />
      </Helmet>

      <DepartmentsHomeView />
    </>
    // </ACLGuard>
  );
}
