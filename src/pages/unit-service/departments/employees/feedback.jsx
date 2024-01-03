import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeFeedbackView from 'src/sections/unit-service/departments/employees/view/feedback-view';
import { useGetDepartment,useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeFeedbackPage() {
  const params = useParams();
  const { id,emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name
  return (
    <>
      <Helmet>
        <title> {name||''} Employee Feedback</title>
      </Helmet>

      {data && employeeData && <DepartmentEmployeeFeedbackView employeeData={employeeData} departmentData={data} />}
    </>
  );
}
