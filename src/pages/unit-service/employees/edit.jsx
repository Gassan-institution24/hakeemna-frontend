import { Helmet } from 'react-helmet-async';

import EmployeeEditView from 'src/sections/unit-service/employees/view/edit';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployee(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="employees" acl="update">
        <Helmet>
          <title>Edit {name || ''} Employee</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeEditView employeeData={data} />}
      </ACLGuard>
    </>
  );
}
