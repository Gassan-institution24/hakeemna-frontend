import { Helmet } from 'react-helmet-async';

import DepartmentWorkGroupEditView from 'src/sections/unit-service/departments/work-groups/table-edit-view';
import { useGetDepartment, useGetWorkGroup } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupEditPage() {
  const params = useParams();
  const { id, acid } = params;
  const departmentData = useGetDepartment(id).data;
  const { data, loading } = useGetWorkGroup(acid);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="update">
        <Helmet>
          <title> Edit {name || ''} Work Group </title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && (
          <DepartmentWorkGroupEditView WorkGroupData={data} departmentData={departmentData} />
        )}
      </ACLGuard>
    </>
  );
}
