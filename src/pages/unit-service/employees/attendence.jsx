import { Helmet } from 'react-helmet-async';

import EmployeeAttendenceView from 'src/sections/unit-service/employees/view/attendence';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeAttendencePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployee(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="attendence" acl="read">
        <Helmet>
          <title>{name || ''} Employee Attendence</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeAttendenceView employeeData={data} />}
      </ACLGuard>
    </>
  );
}
