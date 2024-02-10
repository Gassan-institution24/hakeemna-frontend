import { Helmet } from 'react-helmet-async';

import EmployeeTypeEditView from 'src/sections/unit-service/tables/employee-types/view/edit';
import { useGetEmployeeType } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeTypeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployeeType(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="employee_type" acl="update">
        <Helmet>
          <title>Edit {name || ''} Employee Type</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeTypeEditView employeeTypeData={data} />}
      </ACLGuard>
    </>
  );
}
