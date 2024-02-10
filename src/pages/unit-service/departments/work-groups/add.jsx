import { Helmet } from 'react-helmet-async';

import DepartmentWorkGroupNewView from 'src/sections/unit-service/departments/work-groups/table-create-view';
import { useGetDepartment } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupNewPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="work_groups" acl="create">
        <Helmet>
          <title> New Work Group </title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentWorkGroupNewView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
