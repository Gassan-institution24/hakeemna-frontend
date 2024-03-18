import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetWorkGroup, useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentWorkGroupEditView from 'src/sections/unit-service/departments/work-groups/table-edit-view';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupEditPage() {
  const params = useParams();
  const { id, acid } = params;
  const departmentData = useGetDepartment(id).data;
  const { data, loading } = useGetWorkGroup(acid);
  return (
    <ACLGuard category="department" subcategory="management_tables" acl="update">
      <Helmet>
        <title>{departmentData.name_english} : Edit Work Group</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && (
        <DepartmentWorkGroupEditView WorkGroupData={data} departmentData={departmentData} />
      )}
    </ACLGuard>
  );
}
