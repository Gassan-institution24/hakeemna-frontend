import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentsNewView from 'src/sections/unit-service/departments/view/new';

// ----------------------------------------------------------------------

export default function DepartmentsNewPage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="create">
        <Helmet>
          <title>New Department </title>
        </Helmet>

        <DepartmentsNewView />
      </ACLGuard>
    </>
  );
}
