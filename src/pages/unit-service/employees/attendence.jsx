import { Helmet } from 'react-helmet-async';

import EmployeeAttendenceView from 'src/sections/unit-service/employees/view/attendence';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAttendencePage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployee(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Employee Attendence</title>
      </Helmet>

      {data && <EmployeeAttendenceView employeeData={data} />}
    </>
  );
}
