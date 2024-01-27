import { Helmet } from 'react-helmet-async';

import DepartmentEditView from 'src/sections/unit-service/departments/view/edit';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data,loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="update">
        <Helmet>
          <title> Edit {name || ''} Department </title>
        </Helmet>
        {loading&& <LoadingScreen/>}
        {!loading && <DepartmentEditView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
