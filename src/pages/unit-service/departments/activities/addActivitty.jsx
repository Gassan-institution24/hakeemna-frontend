import { Helmet } from 'react-helmet-async';

import DepartmentActivityNewView from 'src/sections/unit-service/departments/activities/table-create-view';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentActivityNewPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <>
      <Helmet>
        <title> Add Activity </title>
      </Helmet>

      {data && <DepartmentActivityNewView departmentData={data} />}
    </>
  );
}
