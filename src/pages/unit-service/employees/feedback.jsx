import { Helmet } from 'react-helmet-async';

import EmployeeFeedbackView from 'src/sections/unit-service/employees/view/feedback-view';
import { useGetEmployeeEngagement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeFeedbackPage() {
  const params = useParams();
  const { id } = params;
  const employeeData = useGetEmployeeEngagement(id).data;
  const name = employeeData?.first_name
  return (
    <>
      <Helmet>
        <title> {name||''} Employee Feedback</title>
      </Helmet>

      {employeeData && <EmployeeFeedbackView employeeData={employeeData} />}
    </>
  );
}
