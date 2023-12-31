import { Helmet } from 'react-helmet-async';

import DepartmentEditView from 'src/sections/unit-service/departments/view/edit';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title> Edit {name||''} Department </title>
      </Helmet>

      {data && <DepartmentEditView departmentData={data} />}
    </>
  );
}
