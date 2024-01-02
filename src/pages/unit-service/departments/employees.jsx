import { Helmet } from 'react-helmet-async';

import DepartmentEmployeesView from 'src/sections/unit-service/departments/view/employees';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeesPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Department Employees</title>
      </Helmet>

      {data && <DepartmentEmployeesView departmentData={data} />}
    </>
  );
}
