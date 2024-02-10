import { Helmet } from 'react-helmet-async';

import EmployeeOffersView from 'src/sections/unit-service/employees/view/offers-view';
import { useGetEmployee } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeOffersPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployee(id);
  const name = data?.first_name;
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="offers" acl="read">
        <Helmet>
          <title> {name || ''} Employee Offers</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeOffersView employeeData={data} />}
      </ACLGuard>
    </>
  );
}
