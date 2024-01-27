import { Helmet } from 'react-helmet-async';

import EmployeeFeedbackView from 'src/sections/unit-service/employees/view/feedback-view';
import { useGetEmployeeEngagement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeFeedbackPage() {
  const params = useParams();
  const { id } = params;
  const {data,loading} = useGetEmployeeEngagement(id);
  const name = data?.first_name;
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="read">
        <Helmet>
          <title> {name || ''} Employee Feedback</title>
        </Helmet>
        {loading&& <LoadingScreen/>}
        {!loading && <EmployeeFeedbackView employeeData={data} />}
      </ACLGuard>
    </>
  );
}
