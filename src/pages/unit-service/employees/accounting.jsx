import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployee } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeAccountingView from 'src/sections/unit-service/employees/view/accounting-view';

// ----------------------------------------------------------------------

export default function EmployeeAccountingPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployee(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="accounting" acl="read">
      <Helmet>
        <title> {name || ''} Employee Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeAccountingView employeeData={data} />}
    </ACLGuard>
  );
}
