import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentsHomeView from 'src/sections/unit-service/departments/view/home';

// ----------------------------------------------------------------------

export default function DepartmentsHomePage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="departments" acl="read">
        <Helmet>
          <title> Departments </title>
        </Helmet>

        <DepartmentsHomeView />
      </ACLGuard>
  );
}
