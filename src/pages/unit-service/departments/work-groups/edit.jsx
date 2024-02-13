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
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="work_groups" acl="update">
      <Helmet>
        <title> Edit {name || ''} Work Group </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && (
        <DepartmentWorkGroupEditView WorkGroupData={data} departmentData={departmentData} />
      )}
    </ACLGuard>
  );
}
