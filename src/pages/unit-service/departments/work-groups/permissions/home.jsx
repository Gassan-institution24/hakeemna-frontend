import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentWorkGroupPermissionsView from 'src/sections/unit-service/departments/work-groups/permissions/home';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupPermissionsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <ACLGuard category="department" subcategory="permissions" acl="update">
      <Helmet>
        <title>{data.name_english} : permissions</title>
        <meta name="description" content="meta" />
      </Helmet>
      <DepartmentWorkGroupPermissionsView />
    </ACLGuard>
  );
}
