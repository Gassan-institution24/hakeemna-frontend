import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import DepartmentEmployeeNewView from 'src/sections/super-admin/unitservices/departments/employees/view/create-view';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeNewPage() {
  const params = useParams();
  const { depid } = params;
  const { data } = useGetDepartment(depid);
  return (
    <>
      <Helmet>
        <title> Add Employee </title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <DepartmentEmployeeNewView departmentData={data} />}
    </>
  );
}
