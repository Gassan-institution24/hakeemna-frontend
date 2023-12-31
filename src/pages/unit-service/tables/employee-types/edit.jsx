import { Helmet } from 'react-helmet-async';

import EmployeeTypeEditView from 'src/sections/unit-service/tables/employee-types/view/edit';
import { useGetEmployeeType } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeTypeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployeeType(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>Edit {name} Employee Type</title>
      </Helmet>

      {data && <EmployeeTypeEditView employeeTypeData={data} />}
    </>
  );
}
