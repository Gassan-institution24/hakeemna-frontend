import { Helmet } from 'react-helmet-async';

import DepartmentWorkGroupNewView from 'src/sections/unit-service/departments/work-groups/table-create-view';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupNewPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <>
      <Helmet>
        <title> New Work Group </title>
      </Helmet>

      {data && <DepartmentWorkGroupNewView departmentData={data} />}
    </>
  );
}
