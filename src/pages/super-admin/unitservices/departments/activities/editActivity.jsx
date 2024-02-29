import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetActivity, useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentActivityEditView from 'src/sections/super-admin/unitservices/departments/activities/table-edit-view';

// ----------------------------------------------------------------------

export default function DepartmentActivityEditPage() {
  const params = useParams();
  const { depid, acid } = params;
  const departmentData = useGetDepartment(depid).data;
  const { data, loading } = useGetActivity(acid);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="activities" acl="update">
      <Helmet>
        <title> Edit {name || ''} Activity </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && (
        <DepartmentActivityEditView activityData={data} departmentData={departmentData} />
      )}
    </ACLGuard>
  );
}
