import { Helmet } from 'react-helmet-async';

import EmployeeInfoView from 'src/sections/unit-service/employees/view/info';
import { useGetEmployeeEngagement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployeeEngagement(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>{name || ''} Employee Info</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeInfoView employeeData={data} />}
    </>
  );
}
