import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployee } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeOffersView from 'src/sections/unit-service/employees/view/offers-view';

// ----------------------------------------------------------------------

export default function EmployeeOffersPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployee(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="offers" acl="read">
      <Helmet>
        <title> {name || ''} Employee Offers</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeOffersView employeeData={data} />}
    </ACLGuard>
  );
}
