import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployeeType } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeTypeEditView from 'src/sections/unit-service/tables/employee-types/view/edit';

// ----------------------------------------------------------------------

export default function EmployeeTypeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployeeType(id);

  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;

  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Edit Employee Type</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeTypeEditView employeeTypeData={data} />}
    </ACLGuard>
  );
}
