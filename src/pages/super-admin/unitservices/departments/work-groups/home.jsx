import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentWorkGroupsView from 'src/sections/super-admin/unitservices/departments/view/work-groups';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupsPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="work_groups" acl="read">
      <Helmet>
        <title>{name || ''} Department Work Groups</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentWorkGroupsView departmentData={data} />}
    </ACLGuard>
  );
}
