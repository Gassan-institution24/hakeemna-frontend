import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetEmployeeEngagement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeAccountingView from 'src/sections/unit-service/employees/view/accounting-view';

// ----------------------------------------------------------------------

export default function EmployeeAccountingPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployeeEngagement(id);
  return (
    <ACLGuard category="unit_service" subcategory="accounting" acl="read">
      <Helmet>
        <title> {data?.name_english || 'Employee'} : Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeAccountingView employeeData={data} />}
    </ACLGuard>
  );
}
