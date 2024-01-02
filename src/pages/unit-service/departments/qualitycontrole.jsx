import { Helmet } from 'react-helmet-async';

import DepartmentQCView from 'src/sections/unit-service/departments/view/quality-control';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentQCPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Department Quality Control</title>
      </Helmet>

      {data && <DepartmentQCView departmentData={data} />}
    </>
  );
}
