import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentPermissionsView from 'src/sections/unit-service/departments/permissions/home';

// ----------------------------------------------------------------------

export default function DepartmentPermissionsPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="department" subcategory="permissions" acl="update">
      <Helmet>
        <title>{name || ''} Department permissions</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentPermissionsView departmentData={data} />}
    </ACLGuard>
  );
}
