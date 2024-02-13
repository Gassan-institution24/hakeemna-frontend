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
  const name = data?.first_name;
  return (
    <ACLGuard hasContent category="employee" subcategory="accounting" acl="read">
        <Helmet>
          <title> {name || ''} Employee Accounting</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeAccountingView employeeData={data} />}
      </ACLGuard>
  );
}
