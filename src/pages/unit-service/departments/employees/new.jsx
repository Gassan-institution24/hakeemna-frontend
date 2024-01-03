import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeNewView from 'src/sections/unit-service/departments/employees/view/create-view';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeNewPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <>
      <Helmet>
        <title> Add Employee </title>
      </Helmet>

      {data && <DepartmentEmployeeNewView departmentData={data} />}
    </>
  );
}
