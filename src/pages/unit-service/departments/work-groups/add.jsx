import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentWorkGroupNewView from 'src/sections/unit-service/departments/work-groups/table-create-view';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupNewPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    <ACLGuard category="department" subcategory="management_tables" acl="create">
      <Helmet>
        <title> New Work Group </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentWorkGroupNewView departmentData={data} />}
    </ACLGuard>
  );
}
