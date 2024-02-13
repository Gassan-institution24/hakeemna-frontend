import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployeeEngagement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeInfoView from 'src/sections/unit-service/employees/view/info';

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
