import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentsNewView from 'src/sections/unit-service/departments/view/new';

// ----------------------------------------------------------------------

export default function DepartmentsNewPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="departments" acl="create">
        <Helmet>
          <title>New Department </title>
        </Helmet>

        <DepartmentsNewView />
      </ACLGuard>
  );
}
