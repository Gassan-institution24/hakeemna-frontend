import { Helmet } from 'react-helmet-async';

import DepartmentInfoView from 'src/sections/unit-service/departments/view/info';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Department Info</title>
      </Helmet>

      {data && <DepartmentInfoView departmentData={data} />}
    </>
  );
}
