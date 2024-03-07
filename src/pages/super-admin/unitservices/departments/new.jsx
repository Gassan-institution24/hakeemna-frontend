import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentsNewView from 'src/sections/super-admin/unitservices/departments/view/new';

// ----------------------------------------------------------------------

export default function DepartmentsNewPage() {
  return (
    <ACLGuard category="unit_service" subcategory="departments" acl="create">
      <Helmet>
        <title>New Department </title>
        <meta name="description" content="meta" />
      </Helmet>

      <DepartmentsNewView />
    </ACLGuard>
  );
}
