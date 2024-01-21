import { Helmet } from 'react-helmet-async';

import EmployeeInfoView from 'src/sections/unit-service/employees/view/info';
import { useGetEmployeeEngagement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployeeEngagement(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Employee Info</title>
      </Helmet>

      {data && <EmployeeInfoView employeeData={data} />}
    </>
  );
}
