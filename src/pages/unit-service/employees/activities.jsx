import { Helmet } from 'react-helmet-async';

import EmployeeActivitiesView from 'src/sections/unit-service/employees/view/activities-view';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeActivitiesPage() {
  const params = useParams();
  const { id } = params;
  const {data,loading} = useGetEmployee(id);
  const name = data?.first_name;
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="read">
        <Helmet>
          <title> {name || ''} Employee Activities</title>
        </Helmet>
        {loading&& <LoadingScreen/>}
        {!loading && <EmployeeActivitiesView employeeData={data} />}
      </ACLGuard>
    </>
  );
}
