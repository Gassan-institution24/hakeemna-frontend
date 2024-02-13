import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployee } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeEditView from 'src/sections/unit-service/employees/view/edit';

// ----------------------------------------------------------------------

export default function EmployeeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployee(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="unit_service" subcategory="employees" acl="update">
        <Helmet>
          <title>Edit {name || ''} Employee</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeEditView employeeData={data} />}
      </ACLGuard>
  );
}
