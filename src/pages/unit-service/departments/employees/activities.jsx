import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeActivitiesView from 'src/sections/unit-service/departments/employees/view/activities-view';
import { useGetDepartment, useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeActivitiesPage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name;
  return (
    <>
      <ACLGuard hasContent category="employee" subcategory="activities" acl="read">
        <Helmet>
          <title> {name || ''} Employee Activities</title>
        </Helmet>

        {data && employeeData && (
          <DepartmentEmployeeActivitiesView employeeData={employeeData} departmentData={data} />
        )}
      </ACLGuard>
    </>
  );
}
