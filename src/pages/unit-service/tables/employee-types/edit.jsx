import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployeeType } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeTypeEditView from 'src/sections/unit-service/tables/employee-types/view/edit';

// ----------------------------------------------------------------------

export default function EmployeeTypeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployeeType(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title>Edit {name || ''} Employee Type</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeTypeEditView employeeTypeData={data} />}
    </ACLGuard>
  );
}
