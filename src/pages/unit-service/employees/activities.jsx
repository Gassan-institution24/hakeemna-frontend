import { Helmet } from 'react-helmet-async';

import EmployeeActivitiesView from 'src/sections/unit-service/employees/view/activities-view';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeActivitiesPage() {
  const params = useParams();
  const { id } = params;
  const employeeData = useGetEmployee(id).data;
  const name = employeeData?.first_name;
  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Activities</title>
      </Helmet>

      {employeeData && (
        <EmployeeActivitiesView employeeData={employeeData} />
      )}
    </>
  );
}
