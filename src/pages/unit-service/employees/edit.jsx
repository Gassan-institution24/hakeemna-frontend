import { Helmet } from 'react-helmet-async';

import EmployeeEditView from 'src/sections/unit-service/employees/view/edit';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployee(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>Edit {name} Employee</title>
      </Helmet>

      {data && <EmployeeEditView employeeData={data} />}
    </>
  );
}
