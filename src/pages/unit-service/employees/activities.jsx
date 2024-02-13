import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployee } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeActivitiesView from 'src/sections/unit-service/employees/view/activities-view';

// ----------------------------------------------------------------------

export default function EmployeeActivitiesPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployee(id);
  const name = data?.first_name;
  return (
    <ACLGuard hasContent category="employee" subcategory="activities" acl="read">
        <Helmet>
          <title> {name || ''} Employee Activities</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeActivitiesView employeeData={data} />}
      </ACLGuard>
  );
}
