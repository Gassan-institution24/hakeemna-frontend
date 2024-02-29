import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployeeEngagement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeFeedbackView from 'src/sections/unit-service/employees/view/feedback-view';

// ----------------------------------------------------------------------

export default function EmployeeFeedbackPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployeeEngagement(id);
  const name = data?.first_name;
  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Feedback</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeFeedbackView employeeData={data} />}
    </>
  );
}
