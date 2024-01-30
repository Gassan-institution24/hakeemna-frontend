import { Helmet } from 'react-helmet-async';

import DepartmentWorkGroupsView from 'src/sections/unit-service/departments/view/work-groups';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupsPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="work_groups" acl="read">
        <Helmet>
          <title>{name || ''} Department Work Groups</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentWorkGroupsView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
